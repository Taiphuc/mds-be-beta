import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import ProductOptionValueService from "src/services/product-option-value";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/product-option-values", router);

  router.put(
    "/:id/metadata",
    wrapHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { metadata } = req.body;
      const productOptionValueService = req.scope.resolve("productOptionValueService");
      const updatedProductOptionValue = await productOptionValueService.changeMetadata(id, metadata);
      res.json({
        data: updatedProductOptionValue
      });
    })
  );

  router.post(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const { option_id } = req.body

      const productOptionValueService: ProductOptionValueService = req.scope.resolve("productOptionValueService");
      const data = await productOptionValueService.deleteWithAssociate(option_id)

      res.json({
        message: data
      });
    })
  )
};
