import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import PageService from "src/services/page";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/pages", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const pageService: PageService = req.scope.resolve("pageService");
      res.json({ data: await pageService.listAndCount(req.query) });
    })
  );

  router.get(
    "/:id",
    wrapHandler(async (req: Request, res: Response) => {
      const pageService: PageService = req.scope.resolve("pageService");
      res.json({ data: await pageService.findById(req.params.id) });
    })
  );

  router.post(
    "/update",
    wrapHandler(async (req: Request, res: Response) => {
      const pageService: PageService = req.scope.resolve("pageService");
      res.json(await pageService.updateOne(req?.body));
    })
  );

  router.post(
    "/create",
    wrapHandler(async (req: Request, res: Response) => {
      const pageService: PageService = req.scope.resolve("pageService");
      res.json(await pageService.createPage(req?.body));
    })
  );

  router.post(
    "/delete",
    wrapHandler(async (req: Request, res: Response) => {
      const pageService: PageService = req.scope.resolve("pageService");
      res.json(await pageService.deleteOne(req?.body?.id));
    })
  );
};
