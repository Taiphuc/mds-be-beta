import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import { Request, Response } from 'express';
import CustomProductBaseService from '../../../../services/custom-product-base';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/custom-product-base', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const customProductBaseService: CustomProductBaseService =
        req.scope.resolve('customProductBaseService');
      const data = await customProductBaseService.list(req?.query)
      res.json(data);
    })
  );

  router.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const customProductBaseService: CustomProductBaseService =
        req.scope.resolve('customProductBaseService');
      const data = await customProductBaseService.create(req?.body)
      res.json(data);
    })
  );

  router.post(
    '/delete',
    wrapHandler(async (req: Request, res: Response) => {
      const customProductBaseService: CustomProductBaseService =
        req.scope.resolve('customProductBaseService');
      const data = await customProductBaseService.deleteOne(req?.body);
      res.json(data);
    })
  );
};