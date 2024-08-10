import { authenticate, ConfigModule, errorHandler } from '@medusajs/medusa';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Router } from 'express';
import { getConfigFile } from 'medusa-core-utils';
import PrintfulWebhooksService from '../services/printfulWebhooks';
import { attachAdminRoutes } from './routes/admin';
import { attachStoreRoutes } from './routes/store';

export default (rootDirectory: string): Router | Router[] => {
  // Read currently-loaded medusa config
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    'medusa-config'
  );
  const { projectConfig } = configModule;

  // Set up our CORS options objects, based on config
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(','),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(','),
    credentials: true,
  };

  // Set up express router
  const router = Router();

  // Set up root routes for store and admin endpoints, with appropriate CORS settings
  router.use('/store', cors(storeCorsOptions), bodyParser.json());
  router.use('/admin', cors(adminCorsOptions), bodyParser.json());

  // Add authentication to all admin routes *except* auth and account invite ones
  router.use(/\/admin\/((?!auth)(?!invites).*)/, authenticate());

  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  // Set up routers for store and admin endpoints
  const storeRouter = Router();
  const adminRouter = Router();

  // Attach these routers to the root routes
  router.use('/store', storeRouter);
  router.use('/admin', adminRouter);

  // Attach custom routes to these routers
  attachStoreRoutes(storeRouter);
  attachAdminRoutes(adminRouter);

  router.use(errorHandler());
  router.use(bodyParser.json())

  router.post('/printful/webhook', async (req, res) => {
    const data = req.body
    console.info(`webhook working`, data?.type);
    try {
      const printfulWebhookService: PrintfulWebhooksService = req.scope.resolve('printfulWebhooksService')
      await printfulWebhookService.handleWebhook(data)

      res.status(200).send({ message: 'Received the webhook data successfully' })
    }
    catch (error) {
      console.error(error)
      res.status(500).send({ error: 'An error occurred while processing the webhook data' })
    }
  })

  router.post('/test/createProduct', async (req, res) => {
    const data = req.body
    console.info(`webhook working`, data?.type);
    try {
      const printfulWebhookService: PrintfulWebhooksService = req.scope.resolve('printfulWebhooksService')
      await printfulWebhookService.handleWebhook(data)

      res.status(200).send({ message: 'Received the webhook data successfully' })
    }
    catch (error) {
      console.error(error)
      res.status(500).send({ error: 'An error occurred while processing the webhook data' })
    }
  })
  return router;
};
