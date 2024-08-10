import { MedusaRequest, MedusaResponse, wrapHandler } from "@medusajs/medusa";
import { Router } from "express";
import ProductCategoryV2Service from "src/services/product-category-v2";
const router = Router();

interface ReqType extends MedusaRequest {
  session?: any;
}

export default (adminRouter: Router) => {
  adminRouter.use("/product-categories-v2", router);

  router.post(
    "/update",
    wrapHandler(async (req: ReqType, res: MedusaResponse) => {
      try {
        const { categories } = req.body;

        const categoryService: ProductCategoryV2Service = req.scope.resolve(
          "productCategoryV2Service"
        );
        await categoryService.changeMultiCategory(categories);

        res.status(200).json({
          status: "Success",
          message: "Update successfully",
        });
      } catch (err) {
        res.status(400).json({
          status: "Error",
          message: err,
        });
      }
    })
  );
};
