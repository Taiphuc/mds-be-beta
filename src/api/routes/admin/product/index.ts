import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import ProductService from "src/services/product";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/products/update/syncToMerchant", router);

  router.post(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const productService: ProductService = req.scope.resolve("productService");
      res.json({
        data: await productService.updateProductsSyncToMerchant(req.body),
      });
    })
  );
};
