import fs from "fs";
import util from "util";
import fetch from "cross-fetch";

// import aws from "aws-sdk";
import * as path from "path";
import { AbstractFileService } from "@medusajs/medusa";
import stream from "stream";
import {
  DeleteFileType,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "@medusajs/types";
import SettingsService from "./settings";
import { SETTING_TYPES } from "../utils/const/settings";
import sharp from "sharp";

export type S3Config = {
  bucket: string;
  s3_url: string;
  access_key_id: string;
  secret_access_key: string;
  region: string;
  endpoint: string;
  aws_config_object?: S3Config;
};

export type DigitalOceanConfig = {
  bucket: string;
  spaces_url: string;
  access_key_id: string;
  secret_access_key: string;
  region: string;
  endpoint: string;
};

export type FileLocalConfig = {
  upload_dir: string;
  backend_url: string;
};

type InjectedDependencies = {
  settingsService: SettingsService;
};

class FileCustomService extends AbstractFileService {
  protected imageExt = [".png", ".jpg", ".webp", ".svg", ".apng", ".avif", ".gif"];
  protected videoExt = [".webm", ".mkv", ".flv", ".vob", ".ogg", ".avi", ".mp4"];
  protected settingsService_: SettingsService;
  protected uploadTarget_: string = "local";
  protected publicPath = "uploads";
  protected s3Config_: S3Config;
  protected digitalOceanConfig_: DigitalOceanConfig;
  protected localConfig_: FileLocalConfig;
  protected client_: any;
  downloadUrlDuration: number;

  constructor({ settingsService }: InjectedDependencies) {
    super(arguments[0]);
    const defaultPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(defaultPath)) {
      fs.mkdirSync(defaultPath, { recursive: true });
    }
    this.settingsService_ = settingsService;

    this.updateConfig();
  }

  async getImageFromUrl(url: string) {
    const pathname = new URL(url)?.pathname;
    const parsedFilename = path.parse(pathname);
    const fileKey = parsedFilename.base;
    const targetPath = path.join(process.cwd(), this.publicPath, fileKey);
    const fileUrl = `${this.localConfig_?.backend_url || process?.env?.BE_URL}/${this.publicPath}/${fileKey}`;
    if (fs.existsSync(targetPath)) {
      return { url: fileUrl, key: fileKey };
    }
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(targetPath, new Uint8Array(buffer));
    if (this.isImage(parsedFilename.ext) && parsedFilename.ext !== ".webp") {
      const webpPath = this.convertImagePath(targetPath, "webp");
      sharp(targetPath).toFile(webpPath);
    }
    if (this.isImage(parsedFilename.ext) && parsedFilename.ext !== ".avif") {
      const webpPath = this.convertImagePath(targetPath, "avif");
      sharp(targetPath).toFile(webpPath);
    }
    return { url: fileUrl, key: fileKey };
  }

  getImageUrl(url: string) {
    url = new URL(url)?.pathname;
    const parsedFilename = path.parse(url);
    const fileKey = parsedFilename.base;
    const fileUrl = `${this.localConfig_?.backend_url || process?.env?.BE_URL}/${this.publicPath}/${fileKey}`;
    return { url: fileUrl };
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return this.uploadFile(file);
  }

  async uploadProtected(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return this.uploadFile(file, { isProtected: true, acl: "private" });
  }

  async uploadFile(file: Express.Multer.File, options = { isProtected: false, acl: undefined }) {
    // if (this.uploadTarget_ !== "local") {
    //   return await this.uploadFileToCloudAwsOrSpace(file, options);
    // }

    return await this.uploadFileToLocal(file, options);
  }

  async uploadFileToLocal(
    file: Express.Multer.File,
    options = { isProtected: false, acl: undefined }
  ): Promise<FileServiceUploadResult> {
    const parsedFilename = path.parse(file.originalname);
    this.ensureDirExists(parsedFilename.dir);
    let fileKey = path.join(parsedFilename.dir, parsedFilename.base);
    let targetPath = path.join(process.cwd(), this.publicPath, fileKey);

    const getNewFilename = (parsedFilename: path.ParsedPath, counter: number): string => {
      return counter === 0
        ? `${parsedFilename.name.replace(/ /g, '-')}${parsedFilename.ext}`
        : `${parsedFilename.name.replace(/ /g, '-')}-${counter}${parsedFilename.ext}`;
    };
    return new Promise((resolve, reject) => {
      let counter = 0;

      const copyFileWithUniqueName = async () => {
        const newFilename = getNewFilename(parsedFilename, counter);
        targetPath = path.join(process.cwd(), this.publicPath, parsedFilename.dir, newFilename);

        try {
          await fs.promises.copyFile(file.path, targetPath, fs.constants.COPYFILE_EXCL);

          // Image conversion to webp
          if (this.isImage(parsedFilename.ext) && parsedFilename.ext !== ".webp") {
            const webpPath = this.convertImagePath(targetPath, "webp");
            await sharp(targetPath).toFile(webpPath);
          }

          // Image conversion to avif
          if (this.isImage(parsedFilename.ext) && parsedFilename.ext !== ".avif") {
            const avifPath = this.convertImagePath(targetPath, "avif");
            await sharp(targetPath).toFile(avifPath);
          }

          const fileUrl = `${this.localConfig_?.backend_url || process?.env?.BE_URL}/${this.publicPath}/${path.basename(targetPath)}`;
          resolve({ url: fileUrl, key: path.relative(this.publicPath, targetPath) });
        } catch (err) {
          const errorName = util.getSystemErrorName(err.errno);
          if (errorName === 'EEXIST') {
            counter++;
            await copyFileWithUniqueName();
          } else {
            reject(err);
          }
        }
      };

      copyFileWithUniqueName();
    });
  }


  async uploadFileToCloudAwsOrSpace(
    file: Express.Multer.File,
    options = { isProtected: false, acl: undefined }
  ): Promise<FileServiceUploadResult> {
    const parsedFilename = path.parse(file.originalname);
    let fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`;
    const bucket = this.uploadTarget_ === "s3" ? this.s3Config_.bucket : this.digitalOceanConfig_.bucket;
    if (this.isImage(parsedFilename.ext) && parsedFilename.ext !== ".webp") {
      const { key } = await this.uploadFileToLocal(file);
      fileKey = this.convertImagePath(key, "webp");
      const tempPath = path.join(process.cwd(), this.publicPath, fileKey);
      const params = {
        ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
        Bucket: bucket,
        Body: fs.createReadStream(tempPath),
        Key: fileKey,
      };
      await this.client_.upload(params);
    }
    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: bucket,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
    };

    return new Promise<FileServiceUploadResult>((resolve, reject) => {
      this.client_.upload(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (this.uploadTarget_ === "space") {
          resolve({ url: `${this.digitalOceanConfig_.spaces_url}/${data.Key}`, key: data.Key });
        }
        resolve({ url: data.Location, key: data.Key });
      });
    });
  }

  async delete(file: DeleteFileType) {
    // if (this.uploadTarget_ !== "local") {
    //   await this.deleteFromCloudS3OrSpace(file);
    // }
    await this.deleteFromLocal(file);
  }

  async deleteFromLocal(file: DeleteFileType) {
    const filePath = path.join(process.cwd(), `${this.publicPath}/${file.file_key}`);
    const webpPath = this.convertImagePath(filePath, "webp");
    const avifPath = this.convertImagePath(filePath, "avif");
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
    if (fs.existsSync(webpPath)) {
      fs.rmSync(webpPath);
    }
    if (fs.existsSync(avifPath)) {
      fs.rmSync(avifPath);
    }
  }

  async deleteFromCloudS3OrSpace(file: DeleteFileType) {
    this.updateConfig();

    const params = {
      Bucket: this.s3Config_.bucket,
      Key: `${file}`,
    };

    new Promise((resolve, reject) => {
      this.client_.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType): Promise<FileServiceGetUploadStreamResult> {
    // if (this.uploadTarget_ !== "local") {
    //   return await this.getUploadStreamDescriptorFromS3OrSpace(fileData);
    // }

    return await this.getUploadStreamDescriptorLocal(fileData);
  }

  async getUploadStreamDescriptorLocal(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    const parsedFilename = path.parse(fileData.name + (fileData.ext ? `.${fileData.ext}` : ""));
    this.ensureDirExists(parsedFilename?.dir);

    const fileKey = path.join(parsedFilename.dir, `${Date.now()}-${parsedFilename.base}`);
    const fileUrl = `${this.localConfig_?.backend_url || process?.env?.BE_URL}/${this.publicPath}/${fileKey}`;
    const pass = new stream.PassThrough();
    const writeStream = fs.createWriteStream(`${this.publicPath}/${fileKey}`);

    pass.pipe(writeStream); // for consistency with the IFileService

    const promise = new Promise((res, rej) => {
      writeStream.on("finish", res);
      writeStream.on("error", rej);
    });

    return { url: fileUrl, fileKey, writeStream: pass, promise };
  }

  async getUploadStreamDescriptorFromS3OrSpace(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    this.updateConfig();

    const pass = new stream.PassThrough();

    const fileKey = `${fileData.name}.${fileData.ext}`;
    const params = {
      ACL: fileData.acl ?? "private",
      Bucket: this.s3Config_.bucket,
      Body: pass,
      Key: fileKey,
    };
    const url =
      this.uploadTarget_ === "s3"
        ? `${this.s3Config_.s3_url}/${fileKey}`
        : `${this.digitalOceanConfig_.spaces_url}/${fileKey}`;
    return {
      writeStream: pass,
      promise: this.client_.upload(params).promise(),
      url,
      fileKey,
    };
  }

  async getDownloadStream(fileData: GetUploadedFileType): Promise<NodeJS.ReadableStream> {
    // if (this.uploadTarget_ !== "local") {
    //   return await this.getDownloadStreamFromS3OrSpace(fileData);
    // }

    return await this.getDownloadStreamFromLocal(fileData);
  }

  async getDownloadStreamFromLocal(fileData: GetUploadedFileType): Promise<NodeJS.ReadableStream> {
    const filePath = path.join(process.cwd(), `${this.publicPath}/${fileData.fileKey}`);
    return fs.createReadStream(filePath);
  }

  async getDownloadStreamFromS3OrSpace(fileData: GetUploadedFileType): Promise<NodeJS.ReadableStream> {
    this.updateConfig();

    const params = {
      Bucket: this.s3Config_.bucket,
      Key: `${fileData.fileKey}`,
    };

    return this.client_.getObject(params).createReadStream();
  }

  async getPresignedDownloadUrl(fileData: GetUploadedFileType): Promise<string> {
    // if (this.uploadTarget_ !== "local") {
    //   return await this.getPresignedDownloadUrlFromS3orSpace(fileData);
    // }

    return await this.getPresignedDownloadUrlFromLocal(fileData);
  }

  async getPresignedDownloadUrlFromLocal(fileData: GetUploadedFileType): Promise<string> {
    return `${this.localConfig_?.backend_url || process?.env?.BE_URL}/${this.publicPath}/${fileData.fileKey}`;
  }

  async getPresignedDownloadUrlFromS3orSpace(fileData: GetUploadedFileType): Promise<string> {
    const params = {
      Bucket: this.s3Config_.bucket,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadUrlDuration,
    };

    return await this.client_.getSignedUrlPromise("getObject", params);
  }

  async updateConfig(additionalConfiguration = {}) {
    const { storage } = await this.settingsService_.retrieve({ scope: "admin", type: SETTING_TYPES.storage });
    this.uploadTarget_ = storage?.upload_target?.value || "local";

    // if (this.uploadTarget_ === "s3") {
    //   const { s3Config } = await this.settingsService_.retrieve({ scope: "admin", type: SETTING_TYPES.s3Config });
    //   this.s3Config_ = {
    //     access_key_id: s3Config?.access_key_id?.value || "",
    //     bucket: s3Config?.bucket?.value || "",
    //     endpoint: s3Config?.endpoint?.value || "",
    //     region: s3Config?.region?.value || "",
    //     s3_url: s3Config?.s3_url?.value || "",
    //     secret_access_key: s3Config?.secret_access_key?.value || "",
    //   };
    //   // aws.config.setPromisesDependency(null);

    //   const config = {
    //     ...additionalConfiguration,
    //     accessKeyId: this.s3Config_.access_key_id,
    //     secretAccessKey: this.s3Config_.secret_access_key,
    //     region: this.s3Config_.region,
    //     endpoint: this.s3Config_.endpoint,
    //     ...this.s3Config_.aws_config_object,
    //   };

    //   aws.config.update(config, true);
    // }

    // if (this.uploadTarget_ === "space") {
    //   const { digitalOceanSpace } = await this.settingsService_.retrieve({
    //     scope: "admin",
    //     type: SETTING_TYPES.digitalOceanSpace,
    //   });
    //   this.digitalOceanConfig_ = {
    //     access_key_id: digitalOceanSpace?.access_key_id?.value || "",
    //     bucket: digitalOceanSpace?.bucket?.value || "",
    //     endpoint: digitalOceanSpace?.endpoint?.value || "",
    //     region: digitalOceanSpace?.region?.value || "",
    //     secret_access_key: digitalOceanSpace?.secret_access_key?.value || "",
    //     spaces_url: (digitalOceanSpace?.s3_url?.value || "")?.replace(/\/$/, ""),
    //   };
    //   aws.config.setPromisesDependency(null);

    //   const config = {
    //     accessKeyId: this.digitalOceanConfig_.access_key_id,
    //     secretAccessKey: this.digitalOceanConfig_.secret_access_key,
    //     region: this.digitalOceanConfig_.region,
    //     endpoint: this.digitalOceanConfig_.endpoint,
    //     ...additionalConfiguration,
    //   };

    //   aws.config.update(config, true);
    // }

    const data = await this.settingsService_.retrieve({
      scope: "admin",
      type: SETTING_TYPES.localStorage,
    });

    const { localStorage } = data;
    this.localConfig_ = {
      upload_dir: localStorage?.upload_dir?.value || "uploads",
      backend_url: localStorage?.backend_url?.value || "http://localhost:9000",
    };
  }

  private ensureDirExists(dirPath: string) {
    const relativePath = path.join(process.cwd(), this.publicPath, dirPath);
    if (!fs.existsSync(relativePath)) {
      fs.mkdirSync(relativePath, { recursive: true });
    }
  }

  private convertImagePath(path: string, type: string) {
    const newPath = path?.split(".");
    newPath[newPath.length - 1] = type;
    return newPath.join(".");
  }

  private isImage(ext: string) {
    return this.imageExt.includes(ext.toLowerCase());
  }
}

export default FileCustomService;
