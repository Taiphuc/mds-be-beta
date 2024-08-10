import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import PaymentSettingService from 'src/services/payment-setting';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/payment-setting', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const paymentSettingService: PaymentSettingService = req.scope.resolve(
        'paymentSettingService'
      );

      res.json({
        data: await paymentSettingService.retrieve(),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const paymentSettingService: PaymentSettingService = req.scope.resolve(
        'paymentSettingService'
      );

      res.json({
        data: await paymentSettingService.update(req.params.id, req.body),
      });
    })
  );
};
