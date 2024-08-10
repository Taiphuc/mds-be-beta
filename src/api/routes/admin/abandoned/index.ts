import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import { Request, Response } from 'express';
import AbandonedService from 'src/services/abandoned';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/abandoned', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const abandonedService: AbandonedService = req.scope.resolve(
        'abandonedService'
      );
      res.json({
        data: await abandonedService.getAbandoned(req.query),
      });
    })
  );
};
