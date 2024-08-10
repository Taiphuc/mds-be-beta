import { CustomerService, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import PointService from "../../../../services/point";
import DiscountService from "../../../../services/discount";
const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/point", router);

  router.get(
    "/discounts",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      }
      try {
        const pointService: PointService = req.scope.resolve("pointService");
        const data = await pointService.getPointDiscounts({ ...req.query, customer_id: customerId })
        res.json(data);
      } catch (err) {
        console.log("🚀 => wrapHandler => err:", err)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );

  router.get(
    "/admin-discounts",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      }
      try {
        const discountService: DiscountService =
          req.scope.resolve('discountService');
        const data = await discountService.getCustomerAdminDiscounts({...req.query, customer_id: customerId});
        res.json(data);
      } catch (error) {
        console.log("🚀 => wrapHandler => error:", error)
      }
    })
  );

  
  router.get(
    "/history",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      }
      try {
        const pointService: PointService = req.scope.resolve("pointService");
        const data = await pointService.getMany({ ...req.query, customer_id: customerId })
        res.json(data);
      } catch (err) {
        console.log("🚀 => wrapHandler => err:", err)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );

  router.post( 
    "/create-discount",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      }
      try {
        const pointService: PointService = req.scope.resolve("pointService");
        const data = await pointService.createDiscount({
          ...req.body,
          customer_id: customerId
        })
        res.json({ data });
      } catch (err) {
        console.log("🚀 => wrapHandler => err:", err)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );
};
