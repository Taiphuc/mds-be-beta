import { getManyBaseDto } from "./baseDto";

export class GetPointsDto extends getManyBaseDto {
  customer_id: string;
}
export class GetPointDiscountsDto extends getManyBaseDto {
  customer_id: string;
  status: boolean
}

export class CreatePointDiscountDto {
  customer_id: string;
  point: number;
  region: string;
}
