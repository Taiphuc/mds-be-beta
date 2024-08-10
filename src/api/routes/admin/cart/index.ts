import { CartService } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import { MedusaError } from "medusa-core-utils";

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/carts", router);

  router.get(
    "/:id",
    wrapHandler(async (req: Request, res: Response) => {
      const cartService: CartService = req.scope.resolve("cartService");
      if(!req?.params?.id){
        throw new MedusaError(MedusaError.Types.INVALID_DATA, 'cart id not found')
      }
      res.json({
        data: await cartService.retrieveWithTotals(req?.params?.id, {
          relations: []
        }),
      });
    })
  );

  router.post(
    "/:id",
    wrapHandler(async (req: Request, res: Response) => {
      const cartService: CartService = req.scope.resolve("cartService");
      if(!req?.params?.id){
        throw new MedusaError(MedusaError.Types.INVALID_DATA, 'cart id not found')
      }
      res.json({
        data: await cartService.update(req?.params?.id, req?.body),
      });
    })
  );
};
