import { getManyBaseDto } from "./baseDto";

export class GetCustomProductsBaseDto extends getManyBaseDto {
}

export class RetrieveCustomProductBaseDto{
  productId: string;
}

export class DeleteCustomProductBaseDto{
  productId: string;
}