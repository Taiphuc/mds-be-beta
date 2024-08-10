import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import AnalyticsSettingService from 'src/services/analytics-setting';
import { Request, Response } from 'express';
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use('/analytics-setting', router);

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
};
