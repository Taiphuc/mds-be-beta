import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { Request, Response } from "express";
import PrintfulWebhooksService from "../../../../services/printfulWebhooks";
import PrintfulService from "../../../../services/printful";
import PrintfulSyncService from "../../../../services/printful-sync";
import PrintfulFulfillmentService from "../../../../services/printful-fulfillment";
import { EventBusService } from "@medusajs/medusa";
const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/printful", router);

  router.post(
    "/create_webhooks",
    wrapHandler(async (req: Request, res: Response) => {
      const printfulWebhookService: PrintfulWebhooksService = req.scope.resolve('printfulWebhooksService')
      res.json({
        message: await printfulWebhookService.createWebhooks(),
      })
    })
  );

  router.get(
    "/send_order",
    wrapHandler(async (req: Request, res: Response) => {
      const printfulService: PrintfulService = req.scope.resolve('printfulService')
      const orderService = req.scope.resolve('orderService')
      const { order_id } = req.query
      const order = await orderService.retrieve(order_id, { relations: ["items", "items.variant", "shipping_methods", "shipping_address"] })
      if (order) {
        await printfulService.createPrintfulOrder(order)
      }
      res.json({
        message: "Order sent to printful - check your server logs & printful dashboard",
      })
    })
  );

  router.post(
    "/sync",
    wrapHandler(async (req: Request, res: Response) => {
      const eventBusService: EventBusService = req.scope.resolve('eventBusService')
      eventBusService.emit("printful.start_sync",{})
      res.json({
        res: 'sync start',
      })
    })
  );

  router.post(
    "/shipping-rates",
    wrapHandler(async (req: Request, res: Response) => {
      const printfulService: PrintfulService = req.scope.resolve('printfulService')
      res.json({
        res: await printfulService.getShippingRates(req.body),
      })
    })
  );

  router.get(
    "/countries",
    wrapHandler(async (req: Request, res: Response) => {
      const printfulService: PrintfulService = req.scope.resolve('printfulService')
      const countries = await printfulService.getCountryList()
      res.json({
        countries,
      })
    })
  );

  router.post(
    "/create_regions",
    wrapHandler(async (req: Request, res: Response) => {
      const printfulSyncService: PrintfulSyncService = req.scope.resolve('printfulSyncService')
      const { createdRegions, printfulCountries } = await printfulSyncService.createPrintfulRegions()
      res.json({
        createdRegions,
        printfulCountriesRaw: printfulCountries,
      })
    })
  );

  router.get(
    "/initial-countries",
    wrapHandler(async (req: Request, res: Response) => {
      const printfulSyncService = req.scope.resolve('printfulSyncService')
      const countries = await printfulSyncService.createPrintfulRegions()
      res.json({
        countries,
      })
    })
  );

  router.post(
    "/update-settings",
    wrapHandler(async (req: Request, res: Response) => {
      try {
      const printfulSyncService = req.scope.resolve('printfulSyncService')
      const printfulWebhookService: PrintfulWebhooksService = req.scope.resolve('printfulWebhooksService')
      const printfulService: PrintfulService = req.scope.resolve('printfulService')
      const printfulFulfillmentService: PrintfulFulfillmentService = req.scope.resolve('printfulFulfillmentService')
      await printfulWebhookService.applySettings()
      await printfulSyncService.applySettings()
      await printfulService.applySettings()
      await printfulFulfillmentService.applySettings()

        res.status(200).send({ message: 'updated settings successfully' })
      }
      catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while processing the update settings' })
      }
    })
  );
};
