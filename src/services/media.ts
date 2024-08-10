import { TransactionBaseService, generateEntityId } from "@medusajs/medusa";
import ImageRepository from "@medusajs/medusa/dist/repositories/image";
import * as fs from "fs";
import * as path from "path";
import { EntityManager, In } from "typeorm";
import { GetSettingsDto } from "../types/dto/getSettings.dto";
import { GetImagesDto } from "../types/dto/image";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import { getFileKey } from "../utils/getFileKey";
import FileCustomService from "./file-custom";

type InjectedDependencies = {
  manager: EntityManager;
  imageRepository: typeof ImageRepository;
  fileCustomService: FileCustomService;
};

class MediaService extends TransactionBaseService {
  protected imageRepository_: typeof ImageRepository;
  protected fileCustomService_: FileCustomService;
  protected videoExt = [".webm", ".mkv", ".flv", ".vob", ".ogg", ".avi", ".mp4"];

  constructor({ imageRepository, manager, fileCustomService }: InjectedDependencies) {
    super(arguments[0]);
    this.imageRepository_ = manager.withRepository(imageRepository)
    this.fileCustomService_ = fileCustomService
  }

  async retrieve({ scope = "store", type }: GetSettingsDto) {
  }

  async upload(files: Express.Multer.File[]) {
    const images = [];
    let res: any
    for (const file of files) {
      res = await this.fileCustomService_.upload(file);
      fs.unlinkSync(file.path);
      const parsedFilename = path.parse(file.originalname);
      const metadata = {
        type: this.videoExt?.includes(parsedFilename.ext) ? 'video' : 'image'
      }
      images.push({ id: generateEntityId('', 'img'), url: res.url, metadata })
    }
    await this.imageRepository_.save(images);
    return res
  }

  async delete(ids: any) {
    const files = await this.imageRepository_.find({ where: { id: In(ids) }, select: ['url'] })
    await this.imageRepository_.delete(ids);
    try {
      Promise.allSettled(files?.map(file => {
        const file_key = getFileKey(file?.url)
        return this.fileCustomService_.delete({ file_key: file_key, fileKey: '' })
      }))
    } catch (error) {

    }
    return true
  }

  async getMany(payload: GetImagesDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);
    const res = await this.imageRepository_.findAndCount({
      order: { created_at: "DESC" },
      take: limit,
      skip,
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);
    return { data, count, total, page, pageCount };
  }
}

export default MediaService;
