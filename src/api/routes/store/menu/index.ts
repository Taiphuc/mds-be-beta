import { wrapHandler } from "@medusajs/utils";
import { Router, query } from "express";
import { Request, Response } from "express";
import MenuService from "src/services/menu";
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use("/menu", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const menuService: MenuService = req.scope.resolve("menuService");

      res.json(await menuService.retrieve(req?.query));
    })
  );
};
