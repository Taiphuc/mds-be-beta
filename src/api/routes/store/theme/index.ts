import { CustomerService, LineItemService, MedusaRequest, MedusaResponse, RegionService } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import ThemeService from "src/services/theme";
const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/theme", router);

  router.get(
    "/settings",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      try {
        const themeService: ThemeService = req.scope.resolve("themeService");
        const theme = await themeService.getDefaultSetting();

        res.json({ data: theme });
      } catch (err) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );
};
