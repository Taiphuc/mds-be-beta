import { getManyBaseDto } from "./baseDto";

export class GetReviewsOfProductDto extends getManyBaseDto {
  product_id: string;
  rate: number
  keyword: string;
  active: boolean
}

export class CopyCategoryReviewsToProductDto {
  category_id: string;
  product_id: string;
  limit: number;
}
export class GetReviewsOfCategoryDto {
  category_id: string;
  rate: number
  page: number;
  limit: number;
  keyword: string;
  active: boolean
}

export class GetAllReviewsDto {
  rate: number
  page: number;
  limit: number;
  keyword: string;
  active: boolean
}

export class GetAllAbandonedDto {
  rate: number
  page: number;
  limit: number;
}
