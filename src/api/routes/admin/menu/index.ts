import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import MenuService from "src/services/menu";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/menu", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");
      res.json({ data: await menuService.getMenuGroup() });
    })
  );

  router.get(
    "/items",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");
      res.json({ data: await menuService.retrieve(req?.query) });
    })
  );
  router.get(
    "/handles",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");
      res.json({ data: await menuService.getLink(req?.query) });
    })
  );

  router.post(
    "/update",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");
      res.json(await menuService.updateMenu(req?.body));
    })
  );

  router.post(
    "/create",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");
      res.json(await menuService.createMenu(req?.body));
    })
  );

  router.post(
    "/delete",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");
      res.json(await menuService.deleteOne(req?.body?.id));
    })
  );
};
