import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import onboardingRoutes from "./onboarding";
import customRouteHandler from "./custom-route-handler";
import paymentSettingRoutes from "./payment-setting";
import sesRoutes from "./ses";
import smsRoutes from "./sms";
import mailTemplateRoutes from "./mail-template";
import sendMailRoutes from "./send-mail";
import eventsReferenceRoutes from "./events-reference";
import settingRoutes from "./setting";
import settingsRoutes from "./settings";
import segmentRoutes from "./segment";
import analyticsSettingRoutes from "./analytics-setting";
import googleMerchantSettingRoutes from "./google-merchant-setting";
import productRoutes from "./product";
import productReviewRoutes from "./product-review";
import menuRoutes from "./menu";
import pagesRoutes from "./pages";
import carrierSlugRouter from "./carrier-slug";
import sizeGuideRoutes from "./size-guide";
import themeRoutes from "./theme";
import abandonedRoutes from "./abandoned";
import pointRoutes from "./point";
import customerRoutes from "./customer";
import cartsRoutes from "./cart";
import mediaRoutes from "./media";
import productOptionValueRoutes from "./product-option-value";
import printfulRoutes from "./printful";
import customProductBaseRoutes from "./custom-product-base";
import customProductRoutes from "./custom-product";
import imageRoutes from "./image";
import productv2Routes from "./product-v2";
import productCategoryV2Routes from "./product-category-v2";
import productTypeV2 from "./product-type-v2";
import optionPage from "./option-page";
// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/custom", router);

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(customRouteHandler));

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
  paymentSettingRoutes(adminRouter);
  sesRoutes(adminRouter);
  smsRoutes(adminRouter);
  productRoutes(adminRouter);
  mailTemplateRoutes(adminRouter);
  sendMailRoutes(adminRouter);
  settingRoutes(adminRouter);
  settingsRoutes(adminRouter);
  segmentRoutes(adminRouter);
  eventsReferenceRoutes(adminRouter);
  analyticsSettingRoutes(adminRouter);
  googleMerchantSettingRoutes(adminRouter);
  paymentSettingRoutes(adminRouter);
  productReviewRoutes(adminRouter);
  menuRoutes(adminRouter);
  pagesRoutes(adminRouter);
  sizeGuideRoutes(adminRouter);
  themeRoutes(adminRouter);
  abandonedRoutes(adminRouter);
  productOptionValueRoutes(adminRouter);
  pointRoutes(adminRouter);
  customerRoutes(adminRouter);
  cartsRoutes(adminRouter);
  mediaRoutes(adminRouter);
  printfulRoutes(adminRouter);
  customProductBaseRoutes(adminRouter);
  customProductRoutes(adminRouter);
  imageRoutes(adminRouter);
  productv2Routes(adminRouter);
  productCategoryV2Routes(adminRouter);
  productTypeV2(adminRouter);
  carrierSlugRouter(adminRouter);
  optionPage(adminRouter);
}
