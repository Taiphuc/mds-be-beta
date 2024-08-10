import { Lifetime } from "awilix" 
import { CustomerGroupService as MedusaCustomerGroupService } from "@medusajs/medusa";
import CustomerGroupRepository from "@medusajs/medusa/dist/repositories/customer-group";
import { CUSTOMER_GROUP } from "../utils/const/customerGroup";
import { MedusaError } from "medusa-core-utils";

class CustomerGroupService extends MedusaCustomerGroupService {
  private customerGroupRepo_: typeof CustomerGroupRepository;
  static LIFE_TIME = Lifetime.SCOPED

  constructor(container) {
    super(container);
    this.customerGroupRepo_ = container.customerGroupRepository
  }

  async checkIsSubscribedNewProduct(customerId: string){
    const customerGroup = await this.customerGroupRepo_.findOne({ where: { name: CUSTOMER_GROUP.subscribeNewProduct, customers: {id: customerId} } })
    return !!customerGroup
  }

  async updateCustomersSubscribeNewProduct(payload: {
    removeCustomers?: string[],
    addCustomers?: string[],
  }) {
    const customerGroup = await this.customerGroupRepo_.findOne({ where: { name: CUSTOMER_GROUP.subscribeNewProduct } })

    if (!customerGroup) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "CustomerGroup not found please create or migrate subscribe new product --> customer group!")
    }

    if (payload?.addCustomers?.length > 0) {
      await this.addCustomers(customerGroup.id, payload?.addCustomers);
    }

    if (payload?.removeCustomers?.length > 0) {
      await this.removeCustomer(customerGroup.id, payload?.removeCustomers);
    } 
    
    return true;
  }
}

export default CustomerGroupService;
