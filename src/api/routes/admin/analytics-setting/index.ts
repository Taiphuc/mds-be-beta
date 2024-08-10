import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import AnalyticsSettingService from 'src/services/analytics-setting';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/analytics-setting', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const analyticsSettingService: AnalyticsSettingService =
        req.scope.resolve('analyticsSettingService');

      res.json({
        data: await analyticsSettingService.retrieve(),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const analyticsSettingService: AnalyticsSettingService =
        req.scope.resolve('analyticsSettingService');

      res.json({
        data: await analyticsSettingService.update(req.params.id, req.body),
      });
    })
  );
};
