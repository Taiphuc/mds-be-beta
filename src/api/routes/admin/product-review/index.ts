import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import ProductReviewService from "src/services/product-review";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/product-reviews", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");
        res.json(await productReviewService.getProductReviews(req.query));
      } catch (error) {
        console.error("GET REVIEW ERROR ::::", error);
        throw new Error("GET REVIEW ERROR");
      }
    })
  );

  router.post(
    "/copy",
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");
        res.json(await productReviewService.copyCategoryReviewsToProduct(req.body));
      } catch (error) {
        console.error("COPY REVIEW ERROR ::::", error);
        throw new Error("COPY REVIEW ERROR");
      }
    })
  );

  router.post(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");
        res.json(await productReviewService.addProductReview(req.body));
      } catch (error) {
        console.error("Add REVIEW ERROR ::::", error);
        throw new Error("Add REVIEW ERROR");
      }
    })
  );

  router.post(
    "/update/active",
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const productReviewService: ProductReviewService = req.scope.resolve("productReviewService");
        res.json(await productReviewService.updateReviewsActive(req.body));
      } catch (error) {
        console.error("Add REVIEW ERROR ::::", error);
        throw new Error("Add REVIEW ERROR");
      }
    })
  );

  router.post(
    "/delete-many",
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
