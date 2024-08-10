export class CreateReviewDto {
  product_id: string;
  title: string;
  user_name: string;
  email: string;
  rating: number;
  content: string;
}

export class UpdateReviewsActiveDto {
  id: string;
  active: boolean;
}
