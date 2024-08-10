import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import SettingService from 'src/services/setting';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/setting', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const settingService: SettingService =
        req.scope.resolve('settingService');
      res.json({
        data: await settingService.retrieve(),
      });
    })
  );

  router.post(
    '/update',
    wrapHandler(async (req: Request, res: Response) => {
      const settingService: SettingService =
        req.scope.resolve('settingService');

      res.json({
        data: await settingService.update(req.body),
      });
    })
  );
};
