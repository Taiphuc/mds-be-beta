import {wrapHandler} from "@medusajs/utils";
import {Router} from "express";
import {Request, Response} from "express";
import CarrierSlugService from "src/services/carrier-slug";
import {CartService} from "@medusajs/medusa";
import {MedusaError} from "medusa-core-utils";

const router = Router();

export default (adminRouter: Router) => {
    adminRouter.use("/carrier-slug", router);


    router.post(
        "/get-one",
        wrapHandler(async (req: Request, res: Response) => {
            const carrierSlugService: CarrierSlugService = req.scope.resolve("carrierSlugService");
            res.json({
                data: await carrierSlugService.findOneById(req?.body?.id),
            });
        })
    );

    router.get(
        "/",
        wrapHandler(async (req: Request, res: Response) => {
            const carrierSlugService: CarrierSlugService = req.scope.resolve("carrierSlugService");
            res.json({data: await carrierSlugService.listAndCount(req.query)});
        })
    );

    router.post(
        "/update",
        wrapHandler(async (req: Request, res: Response) => {
            const carrierSlugService: CarrierSlugService = req.scope.resolve("carrierSlugService");
            res.json(await carrierSlugService.updateOne(req?.body));
        })
    );

    router.post(
        "/update-order",
        wrapHandler(async (req: Request, res: Response) => {
            const carrierSlugService: CarrierSlugService = req.scope.resolve("carrierSlugService");
            res.json(await carrierSlugService.updateTrackingNumber(req?.body?.order_id, req?.body?.track));
        })
    );

    router.post(
        "/create",
        wrapHandler(async (req: Request, res: Response) => {
            const carrierSlugService: CarrierSlugService = req.scope.resolve("carrierSlugService");
            res.json(await carrierSlugService.createCarrierSlug(req?.body));
        })
    );

    router.post(
        "/delete",
        wrapHandler(async (req: Request, res: Response) => {
            const carrierSlugService: CarrierSlugService = req.scope.resolve("carrierSlugService");
            res.json(await carrierSlugService.deleteOne(req?.body?.id));
        })
    );
};
