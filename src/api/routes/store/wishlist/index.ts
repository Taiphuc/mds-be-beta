import {CustomerService, LineItemService, MedusaRequest, MedusaResponse, RegionService} from "@medusajs/medusa";
import {wrapHandler} from "@medusajs/utils";
import {Router} from "express";
import {MedusaError} from "medusa-core-utils";

const router = Router();

interface ReqType extends MedusaRequest {
    session?: any;
}

export default (storeRouter: Router) => {
    storeRouter.use("/wishlist", router);

    router.get(
        "/",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            const customerId = req?.session?.customer_id;
            if (!customerId) {
                throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
            }
            try {
                const customerService: CustomerService = req.scope.resolve("customerService");
                const customer = await customerService.retrieve(customerId);
                const wishlist = {
                    items: customer?.metadata?.wishlist,
                    first_name: customer?.first_name,
                };

                res.json({data: wishlist});
            } catch (err) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    );

    router.post(
        "/",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            const customerId = req?.session?.customer_id;
            if (!customerId) {
                throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
            }
            try {
                const customerService: CustomerService = req.scope.resolve("customerService");
                const lineItemService: LineItemService = req.scope.resolve("lineItemService");
                const regionService: RegionService = req.scope.resolve("regionService");

                let customer = await customerService.retrieve(customerId);
                const regions = await regionService.list();
                const wishlist: any[] = (customer?.metadata?.wishlist as any[]) || [];
                if (regions.length && !wishlist?.some((w) => w?.variant_id == req.body?.variant_id)) {
                    const lineItem = await lineItemService.generate(req.body.variant_id, regions[0].id, req.body?.quantity, {
                        metadata: req.body?.metadata,
                    });

                    customer = await customerService.update(customer.id, {
                        metadata: {wishlist: [...wishlist, lineItem]},
                    });
                }

                res.json({data: customer});
            } catch (err) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    );

    router.delete(
        "/:variant_id",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            const customerId = req?.session?.customer_id;
            if (!customerId) {
                throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
            }
            try {
                const customerService: CustomerService = req.scope.resolve("customerService");
                const {variant_id} = req?.params;
                let customer = await customerService.retrieve(customerId);
                const wishlist: any[] = (customer?.metadata?.wishlist as any[]) || [];
                const newWishlist = wishlist?.filter((w) => w?.variant_id != variant_id);
                customer = await customerService.update(customer.id, {
                    metadata: {wishlist: newWishlist},
                });
                res.json({data: customer});
            } catch (err) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    );
};
