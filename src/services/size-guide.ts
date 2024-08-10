import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager, In, IsNull, Not } from "typeorm";
import SizeGuideRepository from "src/repositories/size-guide";
import { CreateSizeGuideDto, GetSizeGuideDto } from "src/types/dto/sizeGuideDto";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import ProductTagRepository from "src/repositories/tag";
import ProductCollectionRepository from "src/repositories/collection";
import ProductVariantRepository from "src/repositories/variant";
import SettingsRepository from "src/repositories/settings";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import { Product } from "../models/product";


type InjectedDependencies = {
  manager: EntityManager;
  sizeGuideRepository: typeof SizeGuideRepository;
  productRepository: typeof ProductRepository;
  tagRepository: typeof ProductTagRepository;
  collectionRepository: typeof ProductCollectionRepository;
  variantRepository: typeof ProductVariantRepository;
  settingsRepository: typeof SettingsRepository;
};

class SizeGuideService extends TransactionBaseService {
  protected sizeGuideRepository_: typeof SizeGuideRepository;
  protected productRepository_: typeof ProductRepository;
  protected tagRepository_: typeof ProductTagRepository;
  protected collectionRepository_: typeof ProductCollectionRepository;
  protected variantRepository_: typeof ProductVariantRepository;
  protected settingsRepository_: typeof SettingsRepository;

  constructor({
    sizeGuideRepository,
    productRepository,
    tagRepository,
    collectionRepository,
    variantRepository,
    manager,
    settingsRepository,
  }: InjectedDependencies) {
    super(arguments[0]);
    this.sizeGuideRepository_ = manager.withRepository(sizeGuideRepository);
    this.productRepository_ = manager.withRepository(productRepository);
    this.tagRepository_ = manager.withRepository(tagRepository);
    this.collectionRepository_ = manager.withRepository(collectionRepository);
    this.variantRepository_ = manager.withRepository(variantRepository);
    this.settingsRepository_ = manager.withRepository(settingsRepository);
  }

  async retrieve(payload: GetSizeGuideDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);
    const res = await this.sizeGuideRepository_.findAndCount({
      take: limit,
      skip,
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);
    return { data, count, total, page, pageCount };
  }

  async getOne(id: string | any) {
    const size = await this.sizeGuideRepository_.findOne({
      where: { id: id || "" },
      relations: ["products", "tags", "collections", "variants"],
    });
    const setting = await this.settingsRepository_.findOne({
      where: {
        type: "size-guide",
        key: "default",
      },
    });
    let isDefault = false;
    if (setting?.value == size?.id?.toString()) {
      isDefault = true;
    }
    return { ...size, isDefault };
  }

  async getSizeGuideOfVariant(query: any) {
    let result: any;
    if (query?.variantId) {
      const variant = await this.variantRepository_.findOne({
        where: { id: query?.variantId },
        relations: { sizeGuide: true },
      });
      result = variant?.sizeGuide || null;
    }

    if (!result) {
      const product = await this.productRepository_.findOne({
        where: { id: query?.productId },
        relations: { tags: true },
      });
      if (product?.collection_id) {
        const collection = await this.collectionRepository_.findOne({
          where: { id: product?.collection_id || "" },
          relations: { sizeGuide: true },
        });
        result = collection?.sizeGuide || null;
      }

      if (!result) {
        const tagIds = product?.tags?.map((tag) => tag.id);
        if (tagIds?.length > 0) {
          const tag = await this.tagRepository_.findOne({
            where: { id: In(tagIds), sizeGuideId: Not(IsNull()) },
            relations: { sizeGuide: true },
          });
          result = tag?.sizeGuide || null;
        }
      }
    }

    if (!result) {
      const setting = await this.settingsRepository_.findOne({
        where: {
          type: "size-guide",
          key: "default",
        },
      });
      if (setting?.value) {
        result = await this.sizeGuideRepository_.findOne({ where: { id: +setting?.value } });
      }
    }
    return result;
  }

  async create(payload: CreateSizeGuideDto) {
    if (payload?.default == false && payload?.id) {
      const setting = await this.settingsRepository_.findOne({
        where: {
          type: "size-guide",
          key: "default",
        },
      });
      if (setting && setting?.value == payload?.id?.toString()) {
        await this.settingsRepository_.save({ ...setting, value: "" });
      }
    }
    const products = await this.productRepository_.find({
      where: { id: In(payload?.products) },
    });
    const tags = await this.tagRepository_.find({
      where: { id: In(payload?.tags) },
    });
    const collections = await this.collectionRepository_.find({
      where: { id: In(payload?.collections) },
    });
    const variants = await this.variantRepository_.find({
      where: { id: In(payload?.variants) },
    });

    const size = await this.sizeGuideRepository_.save({
      id: payload?.id || null,
      name: payload?.name,
      topText: payload?.topText,
      content: payload?.content,
      status: payload?.status || false,
      bottomText: payload?.bottomText,
      collections,
      tags,
      products: products as Product[],
      variants,
    });
    if (payload?.default == true && size.status) {
      const setting = await this.settingsRepository_.findOne({
        where: {
          type: "size-guide",
          key: "default",
        },
      });
      await this.settingsRepository_.save({
        ...setting,
        type: "size-guide",
        key: "default",
        scope: "admin",
        value: size?.id.toString(),
      });
    }
    return size;
  }

  async duplicate(id: number): Promise<boolean> {
    const oldSizeGuide = await this.sizeGuideRepository_.findOne({
      where: { id: id || 0 },
      relations: ["collections", "tags", "products", "variants"],
    });
    if (!oldSizeGuide) {
      throw new Error("Size Guide not found");
    }
    delete oldSizeGuide.id;
    await this.sizeGuideRepository_.save(oldSizeGuide);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.sizeGuideRepository_.save({ id, products: [], variants: [], collections: [], tags: [] });
    await this.sizeGuideRepository_.delete(id);
    return true;
  }
}

export default SizeGuideService;
