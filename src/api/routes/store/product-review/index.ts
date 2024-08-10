import { MedusaRequest } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import ProductReviewService from "src/services/product-review";
import { MedusaError } from "medusa-core-utils";

const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/reviews", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");
        req.query.active = 'true';
        res.json(await productReviewService.getProductReviews(req.query));
      } catch (error) {
        console.error("GET REVIEW ERROR ::::", error);
        throw new Error("GET REVIEW ERROR");
      }
    })
  );

  router.post(
    "/",
    wrapHandler(async (req: any, res: Response) => {
      try {
        const customerId = req?.session?.customer_id;
        if (!customerId) {
          throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
        }
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");
        res.json(await productReviewService.addProductReview(req.body));
      } catch (error) {
        console.error("Add REVIEW ERROR ::::", error);
        throw new Error("Add REVIEW ERROR");
      }
    })
  );

  router.delete(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");

        res.json(await productReviewService.deleteReviews(req.body?.ids));
      } catch (error) {
        console.error("DELETE REVIEW ERROR ::::", error);
        throw new Error("DELETE REVIEW ERROR");
      }
    })
  );
};
