import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import SesSettingService from 'src/services/ses-setting';
import { Request, Response } from 'express';
import SESService from 'src/services/ses';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/ses-setting', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const sesSettingService: SesSettingService =
        req.scope.resolve('sesSettingService');
      res.json({
        data: await sesSettingService.retrieve(),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const sesSettingService: SesSettingService =
        req.scope.resolve('sesSettingService');
      const sesService: SESService =
        req.scope.resolve('sesService');
      const data = await sesSettingService.update(req.params.id, req.body)
      await sesService.init()
      res.json({
        data,
      });
    })
  );
};
