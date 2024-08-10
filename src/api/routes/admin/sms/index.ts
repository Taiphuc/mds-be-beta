import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import SmsSettingService from 'src/services/sms-setting';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/sms-setting', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const smsSettingService: SmsSettingService =
        req.scope.resolve('smsSettingService');
      res.json({
        data: await smsSettingService.retrieve(),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const smsSettingService: SmsSettingService =
        req.scope.resolve('smsSettingService');

      res.json({
        data: await smsSettingService.update(req.params.id, req.body),
      });
    })
  );
};
