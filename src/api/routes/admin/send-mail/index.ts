import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import sendMailService from 'src/services/send-mail';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/send-mail', router);

  router.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const sendMailService: sendMailService =
        req.scope.resolve('sendMailService');

      res.json({
        data: await sendMailService.sendMail(req.body),
      });
    })
  );
};
