import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import ThemeService from "src/services/theme";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/theme", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const themeService: ThemeService = req.scope.resolve("themeService");
      res.json(await themeService.retrieve(req?.query));
    })
  );

  router.get(
    "/:id",
    wrapHandler(async (req: Request, res: Response) => {
      const themeService: ThemeService = req.scope.resolve("themeService");
      res.json({
        data: await themeService.getOne(req?.params?.id as string),
      });
    })
  );

  router.post(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const themeService: ThemeService = req.scope.resolve("themeService");
      res.json({
        data: await themeService.create(req?.body),
      });
    })
  );

  router.post(
    "/update",
    wrapHandler(async (req: Request, res: Response) => {
      const themeService: ThemeService = req.scope.resolve("themeService");
      res.json({
        data: await themeService.update(req?.body),
      });
    })
  );


  
  router.post(
    "/duplicate",
    wrapHandler(async (req: Request, res: Response) => {
      const themeService: ThemeService = req.scope.resolve("themeService");
      res.json({
        data: await themeService.duplicate(req?.body?.id as number),
      });
    })
  );


  router.post(
    "/delete",
    wrapHandler(async (req: Request, res: Response) => {
      const themeService: ThemeService = req.scope.resolve("themeService");
      res.json({
        data: await themeService.delete(req?.body?.id as number),
      });
    })
  );
};
