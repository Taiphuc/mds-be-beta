import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import GoogleMerchantSettingService from 'src/services/google-merchant-setting';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/google-merchant-setting', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const googleMerchantSettingService: GoogleMerchantSettingService =
        req.scope.resolve('googleMerchantSettingService');
      res.json({
        data: await googleMerchantSettingService.retrieve(),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const googleMerchantSettingService: GoogleMerchantSettingService =
        req.scope.resolve('googleMerchantSettingService');

      res.json({
        data: await googleMerchantSettingService.update(
          req.params.id,
          req.body
        ),
      });
    })
  );
};
