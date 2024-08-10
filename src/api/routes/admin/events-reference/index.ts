import { wrapHandler } from '@medusajs/utils';
import { Router } from 'express';
import EventsReferenceService from 'src/services/events-reference';
import { Request, Response } from 'express';
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use('/events-reference', router);

  router.get(
    '/',
    wrapHandler(async (req: Request, res: Response) => {
      const eventsReferenceService: EventsReferenceService = req.scope.resolve(
        'eventsReferenceService'
      );
      res.json({
        data: await eventsReferenceService.list(req.query),
      });
    })
  );

  router.post(
    '/update/:id',
    wrapHandler(async (req: Request, res: Response) => {
      const eventsReferenceService: EventsReferenceService = req.scope.resolve(
        'eventsReferenceService'
      );

      res.json({
        data: await eventsReferenceService.update(req.params.id, req.body),
      });
    })
  );
};
