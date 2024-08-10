import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import SizeGuideService from "src/services/size-guide";
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use("/size-guide", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const sizeGuideService: SizeGuideService = req.scope.resolve("sizeGuideService");
      res.json({data: await sizeGuideService.getSizeGuideOfVariant(req?.query)});
    })
  );
};
