import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import { Request, Response } from 'express';
import CustomProductService from '../../../../services/custom-product';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/custom-product', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const customProductService: CustomProductService =
        req.scope.resolve('customProductService');
      const data = await customProductService.list(req?.query)
      res.json(data);
    })
  );

  router.post(
    '/delete',
    wrapHandler(async (req: Request, res: Response) => {
      const customProductService: CustomProductService =
        req.scope.resolve('customProductService');
      const data = await customProductService.deleteOne(req?.body);
      res.json(data);
    })
  );
};

