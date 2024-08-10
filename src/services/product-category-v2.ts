import { ProductCategory, TransactionBaseService } from "@medusajs/medusa";
import { updateProductCategoryDTO } from "src/types/dto/productCategoryDto";
import { EntityManager } from "typeorm";

type updateProductCategoryFields = {
  name?: string;
  description?: string;
  handle?: string;
  is_internal?: boolean;
  is_active?: boolean;
  parent_category_id?: string;
  rank?: number;
  metadata?: Record<string, any>;
};

class ProductCategoryV2Service extends TransactionBaseService {
  protected manager_: EntityManager;
  constructor(container) {
    super(container);
    this.manager_ = container.manager;
  }

  async changeMultiCategory(payload: updateProductCategoryDTO[]) {
    const productCategoryRepository =
      this.manager_.getRepository(ProductCategory);
    try {
      for (const category of payload) {
        const {
          id,
          name,
          handle,
          description,
          is_active,
          is_internal,
          parent_category_id,
          rank,
          metadata,
        } = category;

        const update: updateProductCategoryFields = {
          name,
          handle,
          description,
          is_active,
          is_internal,
          rank,
          metadata,
        };
        const parent_category = await productCategoryRepository.findOne({
          where: { id: parent_category_id },
        });
        if (parent_category) update.parent_category_id = parent_category_id;

        await productCategoryRepository.update(id, update);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default ProductCategoryV2Service;
