import { getManyBaseDto } from "./baseDto";

export class GetCustomerAdminDiscountsDto extends getManyBaseDto {
  customer_id: string;
  status: string
}