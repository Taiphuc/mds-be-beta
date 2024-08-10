import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import MailTemplateService from 'src/services/mail-template';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/mail-template', router);

  router.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const mailTemplateService: MailTemplateService = req.scope.resolve(
        'mailTemplateService'
      );

      res.json({
        data: await mailTemplateService.create(req.body),
      });
    })
  );

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const mailTemplateService: MailTemplateService = req.scope.resolve(
        'mailTemplateService'
      );
      res.json({
        data: await mailTemplateService.list(req.query),
      });
    })
  );

  router.get(
    '/all',
    wrapHandler(async (req: Request, res: Response) => {
      const mailTemplateService: MailTemplateService = req.scope.resolve(
        'mailTemplateService'
      );
      res.json({
        data: await mailTemplateService.all(),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const mailTemplateService: MailTemplateService = req.scope.resolve(
        'mailTemplateService'
      );

      res.json({
        data: await mailTemplateService.update(req.params.id, req.body),
      });
    })
  );

  router.delete(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const mailTemplateService: MailTemplateService = req.scope.resolve(
        'mailTemplateService'
      );

      res.json({
        data: await mailTemplateService.delete(req.params.id),
      });
    })
  );
};
