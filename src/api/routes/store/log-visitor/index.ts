import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import LogVisitorService from "src/services/log-visitor";
const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/log-visitor", router);
  router.post(
    "/",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      try {
        const logVisitorService: LogVisitorService = req.scope.resolve("logVisitorService");
        res.json({ data: await logVisitorService.update(req, req?.body?.productId) });
      } catch (err) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );
};
