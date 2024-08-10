import {wrapHandler} from "@medusajs/utils";
import {Router} from "express";
import {Request, Response} from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import MediaService from "src/services/media";

const router = Router();
const upload = multer({dest: "media/upload/"})

export default (adminRouter: Router) => {
    adminRouter.use("/media", router);

    router.get(
        "/",
        wrapHandler(async (req: Request, res: Response) => {
            const mediaService: MediaService = req.scope.resolve("mediaService");
            res.json(await mediaService.getMany(req.query));
        })
    );

    router.post(
        "/upload",
        upload.array('files'),
        wrapHandler(async (req: Request, res: Response) => {
            const mediaService: MediaService = req.scope.resolve("mediaService");
            res.json(await mediaService.upload(req?.files as Express.Multer.File[]));
        })
    );

    router.post(
        "/delete",
        wrapHandler(async (req: Request, res: Response) => {
            const mediaService: MediaService = req.scope.resolve("mediaService");
            res.json(await mediaService.delete(req?.body?.ids));
        })
    );

    router.post(
        "/upload-from-url",
        wrapHandler(async (req: any, res: any) => {
            const mediaService: MediaService = req.scope.resolve("mediaService");
            const {url} = req.body;

            if (!url) {
                return res.status(400).json({message: "URL is required"});
            }

            try {
                // Download the image
                const response = await axios.get(url, {responseType: "stream"});
                const fileName = path.basename(url);
                const filePath = path.join("media/upload/", fileName);


                // Save the image to the local file system
                const writer = fs.createWriteStream(filePath);

                response.data.pipe(writer);

                writer.on("finish", async () => {
                    // Upload the file using MediaService
                    const file:any = {
                        fieldname: "file",
                        originalname: fileName,
                        encoding: "7bit",
                        mimetype: response.headers["content-type"],
                        destination: "media/upload/",
                        filename: fileName,
                        path: filePath,
                        size: fs.statSync(filePath).size,
                    };

                    const uploadResponse = await mediaService.upload([file]);
                    res.json(uploadResponse);
                });

                writer.on("error", (error) => {
                    res.status(500).json({message: "Error saving the file", error});
                });
            } catch (error) {
                res.status(500).json({message: "Error downloading the image", error});
            }
        })
    );
};
