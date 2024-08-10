import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import multer from "multer";
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types'

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/image", router);

  router.post(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const url = new URL(req?.body?.url as string);
      const pathname = path.join(process.cwd(), url?.pathname);
      const file = fs.readFileSync(pathname);
      const parsePath = path.parse(pathname);
      const contentType = mime?.lookup(parsePath.ext) || 'application/octet-stream';
      const dataURL = `data:${contentType};base64,${file.toString('base64')}`;
      res.status(200).send({
        data: dataURL,
      });
    })
  );
};
