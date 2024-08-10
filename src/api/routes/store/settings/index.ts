import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import SettingsService from "src/services/settings";
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use("/settings", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const settingsService: SettingsService = req.scope.resolve("settingsService");
      res.json(await settingsService.retrieve({ scope: "store" }));
    })
  );
};
