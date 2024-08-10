import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import SettingsService from "src/services/settings";
import FileCustomService from "../../../../services/file-custom";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/settings", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const settingsService: SettingsService = req.scope.resolve("settingsService");
      const { type } = req?.query;
      res.json(await settingsService.retrieve({ scope: "admin", type: type as string }));
    })
  );

  router.post(
    "/create",
    wrapHandler(async (req: Request, res: Response) => {
      const settingsService: SettingsService = req.scope.resolve("settingsService");
      const { key, value } = req.body
      res.json(await settingsService.create({ key, value, type: req.body?.type || 'staticContent' }))
    })
  )

  router.post(
    "/update",
    wrapHandler(async (req: Request, res: Response) => {
      const settingsService: SettingsService = req.scope.resolve("settingsService");
      res.json(await settingsService.update(req.body));
    })
  );

  router.post(
    "/storage-settings-apply",
    wrapHandler(async (req: Request, res: Response) => {
      const fileCustomService: FileCustomService = req.scope.resolve("fileCustomService");
      await fileCustomService.updateConfig()
      res.json({ data: true });
    })
  );
};
