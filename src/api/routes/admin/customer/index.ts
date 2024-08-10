import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import { Request, Response } from 'express';
import DiscountService from 'src/services/discount';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/cus-customer', router);
  router.get(
    '/discounts',
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const discountService: DiscountService =
          req.scope.resolve('discountService');
        const data = await discountService.getCustomerAdminDiscounts(req.query);
        res.json(data);
      } catch (error) {
        console.log("🚀 => wrapHandler => error:", error)
      }
    })
  );

  router.post(
    '/discounts-sendmail',
    wrapHandler(async (req: Request, res: Response) => {
      try {
        const discountService: DiscountService =
          req.scope.resolve('discountService');
        const data = await discountService.sendDiscountForCustomer(req?.body?.discount_id as string);
        res.json(data);
      } catch (error) {
        console.log("🚀 => wrapHandler => error:", error)
      }
    })
  );
};
