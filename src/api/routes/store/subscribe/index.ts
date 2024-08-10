import { MedusaRequest, MedusaResponse, RegionService } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import CustomerGroupService from "../../../../services/customer-group";
const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/subscribe", router);

  router.get(
    "/new-product",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      }
      try {
        const customerGroupService: CustomerGroupService = req.scope.resolve("customerGroupService");
        const data =  await customerGroupService.checkIsSubscribedNewProduct(customerId);
        res.json({ data });
      } catch (err) {
        console.log("🚀 => wrapHandler => e:", err)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );


  router.post(
    "/new-product",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      const customerId = req?.session?.customer_id;
      if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
      }
      try {
        const customerGroupService: CustomerGroupService = req.scope.resolve("customerGroupService");
        let payload: any = {};
        if(req?.body?.type === 'add'){
         payload = {addCustomers: [customerId]}
        }
        if(req?.body?.type === 'remove'){
          payload = {removeCustomers: [customerId]}
         }
        const data =  await customerGroupService.updateCustomersSubscribeNewProduct(payload);
        res.json({ data });
      } catch (err) {
        console.log("🚀 => wrapHandler => e:", err)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
      }
    })
  );

};
