import { wrapHandler } from "@medusajs/utils";
import { Router, query } from "express";
import { Request, Response } from "express";
import PageService from "src/services/page";
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use("/pages", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const pageService: PageService = req.scope.resolve("pageService");
      res.json(await pageService.getByCode(req?.query?.code as string));
    })
  );
};
