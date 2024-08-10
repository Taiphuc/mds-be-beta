import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import { Request, Response } from 'express';
import PointService from 'src/services/point';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/point', router);

  router.get(
    '/customer/points',
    wrapHandler(async (req: Request, res: Response) => {
      const pointService: PointService =
        req.scope.resolve('pointService');
      const data = await pointService.getMany(req.query);
      res.json(data);
    })
  );

  router.get(
    '/customer/discounts',
    wrapHandler(async (req: Request, res: Response) => {
      const pointService: PointService =
        req.scope.resolve('pointService');
      const data = await pointService.getPointDiscounts(req.query);
      res.json(data);
    })
  );
};
