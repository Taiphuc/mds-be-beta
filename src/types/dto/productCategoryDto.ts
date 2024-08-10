export class updateProductCategoryDTO {
  id: string;
  name?: string;
  description?: string;
  handle?: string;
  is_internal?: boolean;
  is_active?: boolean;
  parent_category_id?: string;
  rank?: number;
  metadata?: Record<string, any>;
}
