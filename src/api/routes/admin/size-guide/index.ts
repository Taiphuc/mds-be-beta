import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import SizeGuideService from "src/services/size-guide";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/size-guide", router);

  router.get(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const sizeGuideService: SizeGuideService = req.scope.resolve("sizeGuideService");
      res.json(await sizeGuideService.retrieve(req?.query));
    })
  );

  router.get(
    "/one",
    wrapHandler(async (req: Request, res: Response) => {
      const sizeGuideService: SizeGuideService = req.scope.resolve("sizeGuideService");
      res.json({
        data: await sizeGuideService.getOne(req?.query?.id as string),
      });
    })
  );

  router.post(
    "/",
    wrapHandler(async (req: Request, res: Response) => {
      const sizeGuideService: SizeGuideService = req.scope.resolve("sizeGuideService");
      res.json({
        data: await sizeGuideService.create(req?.body),
      });
    })
  );

  router.post(
    "/duplicate",
    wrapHandler(async (req: Request, res: Response) => {
      const sizeGuideService: SizeGuideService = req.scope.resolve("sizeGuideService");
      res.json({
        data: await sizeGuideService.duplicate(req?.body?.id as number),
      });
    })
  );

  router.post(
    "/delete",
    wrapHandler(async (req: Request, res: Response) => {
      const sizeGuideService: SizeGuideService = req.scope.resolve("sizeGuideService");
      res.json({
        data: await sizeGuideService.delete(req?.body?.id as number),
      });
    })
  );
};
