import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import SegmentService from 'src/services/segment';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/segment', router);

  router.post(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const segmentService: SegmentService =
        req.scope.resolve('segmentService');

      res.json({
        data: await segmentService.create(req.body),
      });
    })
  );

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const segmentService: SegmentService =
        req.scope.resolve('segmentService');
      res.json({
        data: await segmentService.list(req.query),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const segmentService: SegmentService =
        req.scope.resolve('segmentService');

      res.json({
        data: await segmentService.update(req.params.id, req.body),
      });
    })
  );

  router.delete(
    '/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const segmentService: SegmentService =
        req.scope.resolve('segmentService');

      res.json({
        data: await segmentService.delete(req.params.id),
      });
    })
  );
};
