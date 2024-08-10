import { Router } from "express";
import customRouteHandler from "./custom-route-handler";
import { wrapHandler } from "@medusajs/medusa";
import paymentSettingRoutes from "./payment-setting";
import analyticsSettingRoutes from "./analytics-setting";
import productReviewRoutes from "./product-review";
import settingsRoutes from "./settings";
import menuRoutes from "./menu";
import pageRoutes from "./page";
import sizeGuideRoutes from "./size-guide";
import wishlistRoutes from "./wishlist";
import themeRoutes from "./theme";
import crossSellRoutes from "./cross-sell";
import logVisitorRoutes from "./log-visitor";
import pointRoutes from "./point";
import subscribeRoutes from "./subscribe";
import customProductRoutes from "./custom-product";
import uploadRoutes from "./upload";
import imageRoutes from "./image";
import productv2Routes from "./product-v2";
import trackEventRoutes from "./track-event";
import checkoutRoutes from "./checkout";
import suggestRoutes from "./suggest";
import optionPageRoutes from "./option-page";
import customerRouter from "./customer";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/custom", router);

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(customRouteHandler));

  paymentSettingRoutes(storeRouter);
  menuRoutes(storeRouter);
  pageRoutes(storeRouter);
  settingsRoutes(storeRouter);
  analyticsSettingRoutes(storeRouter);
  productReviewRoutes(storeRouter);
  sizeGuideRoutes(storeRouter);
  wishlistRoutes(storeRouter);
  themeRoutes(storeRouter);
  crossSellRoutes(storeRouter);
  logVisitorRoutes(storeRouter);
  pointRoutes(storeRouter);
  subscribeRoutes(storeRouter);
  customProductRoutes(storeRouter);
  uploadRoutes(storeRouter);
  imageRoutes(storeRouter);
  productv2Routes(storeRouter);
  trackEventRoutes(storeRouter);
  checkoutRoutes(storeRouter);
  suggestRoutes(storeRouter);
  optionPageRoutes(storeRouter);
  customerRouter(storeRouter);
}
