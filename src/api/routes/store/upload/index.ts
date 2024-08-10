import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import multer from "multer";
import MediaService from "../../../../services/media";
const router = Router();
const upload = multer({ dest: "upload" })

interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/upload", router);

  router.post(
    "/",
    upload.array('files'),
    wrapHandler(async (req: any, res: MedusaResponse) => {
      // const customerId = req?.session?.customer_id;
      // if (!customerId) {
      //   throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      // }
      try {
        const mediaService:MediaService = req.scope.resolve("mediaService");
        const data = await mediaService.upload(req?.files as Express.Multer.File[]);
        res.json({ data });
      } catch (err) {
        console.log("🚀 => wrapHandler => err:", err)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );
};
