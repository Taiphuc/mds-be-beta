// File: ./services/ProductOptionValueService.ts
import { ProductOption, ProductOptionValue, ProductVariant, TransactionBaseService } from '@medusajs/medusa';
import { EntityManager, In } from 'typeorm';

type Options = {
  option_id: string
  value?: string
  metadata?: Record<string, any>
}
class ProductOptionValueService extends TransactionBaseService {
  protected manager_: EntityManager;
  constructor(container) {
    super(container);
    this.manager_ = container.manager;
  }

  async changeMetadata(id, newMetadata) {
    const productOptionValueRepository = this.manager_.getRepository(ProductOptionValue);
    try {
      const productOptionValue = await productOptionValueRepository.findOne({ where: { id: id } });

      if (!productOptionValue) {
        throw new Error("ProductOptionValue not found");
      }

      productOptionValue.metadata = newMetadata;
      await productOptionValueRepository.save(productOptionValue);
      return productOptionValue;
    } catch (error) {
      console.error(error);
    }
  }

  async changeMultiMetadata(variant_id: string, options: Options[]) {
    const productOptionValueRepository = this.manager_.getRepository(ProductOptionValue);
    try {
      for (const option of options) {
        const { option_id, value, metadata } = option

        await productOptionValueRepository.update({ option_id, variant_id }, { value, metadata })
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteWithAssociate(option_id: string) {
    try {
      const result = await this.manager_.transaction(async transactionalEntityManager => {
        const productOptionValueRepository = transactionalEntityManager.getRepository(ProductOptionValue);
        const productOptionRepository = transactionalEntityManager.getRepository(ProductOption)
        const productVariantRepository = transactionalEntityManager.getRepository(ProductVariant)

        const findProductOptionValue = await productOptionValueRepository
          .find({ where: { option_id: option_id } })

        if (!findProductOptionValue) {
          throw new Error("ProductOptionValue not found");
        }

        let variantIds = []
        findProductOptionValue.map(f => variantIds.push(f.variant_id))

        await productVariantRepository.update({ id: In(variantIds) }, { deleted_at: new Date() })
        await productOptionValueRepository.update({ option_id }, { deleted_at: new Date() });
        await productOptionRepository.update({ id: option_id }, { deleted_at: new Date() });

        return true
      })

      return result
    } catch (err) {
      return false
    }
  }
}

export default ProductOptionValueService;