import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import PaymentSettingService from 'src/services/payment-setting';
import { Request, Response } from 'express';
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use('/payment-setting', router);

  router.get(
    '/:type',
    wrapHandler(async (req: Request, res: Response) => {
      const paymentSettingService: PaymentSettingService = req.scope.resolve(
        'paymentSettingService'
      );

      res.json({
        publicKey: await paymentSettingService.publicKeyByType(req.params.type),
      });
    })
  );
};
