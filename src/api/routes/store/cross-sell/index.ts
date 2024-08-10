import { CustomerService, LineItemService, MedusaRequest, MedusaResponse, RegionService } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import ProductService from "../../../../services/product";
const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/cross-sell", router);

  router.get(
    "/:id",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      try {
        const productService: ProductService = req.scope.resolve("productService");
        const products = await productService.relatedProduct(req?.params?.id as string, customerId, req?.ip);
        res.json({ data: products });
      } catch (err) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );


    storeRouter.use("/cross-sell", router);
    router.post(
        "/",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            const customerId = req?.session?.customer_id;
            const { productIds } = req.body; // Expecting productIds as an array in the body
            if (!Array.isArray(productIds) || productIds.length === 0) {
                throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Product IDs must be a non-empty array");
            }
            try {
                const productService: ProductService = req.scope.resolve("productService");
                const products = await productService.relatedProducts(productIds, customerId, req.ip);
                res.json({ data: products });
            } catch (err) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Something went wrong");
            }
        })
    );
};
