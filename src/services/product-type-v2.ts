import { ProductType, TransactionBaseService } from "@medusajs/medusa";
import { pick } from "lodash";
import { EntityManager } from "typeorm";

export type TSetMetadataPayload = {
  key: string
  value: string
  typeId: string
}

class ProductTypeV2Service extends TransactionBaseService {
  protected manager_: EntityManager;
  constructor(container) {
    super(container);
    this.manager_ = container.manager;
  }

  async setProductTypesMetadata(payload: TSetMetadataPayload[]) {
    const productTypeRepository =
      this.manager_.getRepository(ProductType);
    try {
      for (const item of payload) {
        const {
          typeId,
          key,
          value,
        } = item;

        const updateType = await productTypeRepository.findOne({ where: { id: typeId } })
        if (updateType) {
          if (!updateType.metadata) {
            updateType.metadata = {};
          }

          updateType.metadata[key] = value;

          await productTypeRepository.update({ id: typeId }, { metadata: updateType.metadata });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getProductTypes(params: { limit: number, offset: number }) {
    const productTypeRepository =
      this.manager_.getRepository(ProductType);
    try {
      const {
        limit,
        offset,
      } = params;

      const listProductTypes = await productTypeRepository.findAndCount({ skip: offset, take: limit })
      return listProductTypes
    }
    catch (error) {
      console.error(error);
    }
  }
}

export default ProductTypeV2Service;