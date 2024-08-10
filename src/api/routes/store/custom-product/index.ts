import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import CustomProductBaseService from "../../../../services/custom-product-base";
import CustomProductService from "../../../../services/custom-product";
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use("/custom-product", router);

  router.get(
    "/base",
    wrapHandler(async (req: Request, res: Response) => {
      const customProductBaseService: CustomProductBaseService = req.scope.resolve("customProductBaseService");
      res.json({data: await customProductBaseService.retrieve(req?.query)});
    })
  );


  router.post(
    "/add",
    wrapHandler(async (req: Request, res: Response) => {
      const customProductService: CustomProductService = req.scope.resolve("customProductService");
      res.json({data: await customProductService.add(req?.body)});
    })
  );
};
