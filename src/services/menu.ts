import {
  ProductCategoryService,
  ProductCollectionService,
  ProductService,
  TransactionBaseService,
} from "@medusajs/medusa";
import { EntityManager, ILike, IsNull } from "typeorm";
import MenuRepository from "src/repositories/menu";
import { UpdateMenuDto } from "src/types/dto/updateMenuDto";
import PageService from "./page";

type InjectedDependencies = {
  manager: EntityManager;
  menuRepository: typeof MenuRepository;
  productCollectionService: ProductCollectionService;
  productService: ProductService;
  pageService: PageService;
  productCategoryService: ProductCategoryService;
};

class MenuService extends TransactionBaseService {
  protected menuRepository_: typeof MenuRepository;
  protected productCollectionService_: ProductCollectionService;
  protected productService_: ProductService;
  protected pageService_: PageService;
  protected productCategoryService_: ProductCategoryService;

  constructor({
    menuRepository,
    productCollectionService,
    productService,
    pageService,
    productCategoryService,
  }: InjectedDependencies) {
    super(arguments[0]);
    this.menuRepository_ = menuRepository;
    this.productCollectionService_ = productCollectionService;
    this.productService_ = productService;
    this.pageService_ = pageService;
    this.productCategoryService_ = productCategoryService;
  }

  async retrieve(query: any) {
    const menuRepository = this.activeManager_.withRepository(this.menuRepository_);
    const menu = await menuRepository.find({
      where: { parent_id: query?.parent_id || IsNull() },
      order: { order: "ASC", children: { order: "ASC", children: { order: "ASC", children: { order: "ASC" } } } },
      relations: { children: { children: { children: true } } },
    });
    return menu;
  }

  async getMenuGroup() {
    const menuRepository = this.activeManager_.withRepository(this.menuRepository_);
    const group = await menuRepository.find({
      where: { parent_id: IsNull() },
      order: { order: "ASC" },
      relations: { children: true },
    });
    const result = group?.map((group) => {
      const listMenu = group?.children?.map((child) => child?.title) || [];
      return { id: group.id, slug: group?.link, title: group.title, listMenu: listMenu.join(", ") };
    });
    return result;
  }

  async getLink(query: any) {
    const { type } = query;
    let result: { title: string; handle: string }[];
    if (type === "collection") {
      const collections = await this.productCollectionService_.list();
      result = collections?.map((collection) => ({
        title: collection.title,
        handle: "store?collection_id=" + collection.id,
      }));
    }
    if (type === "categories") {
      delete query?.type;
      const categories = await this.productCategoryService_.listAndCount(query?.title ? { q: query?.title } : {});
      result = categories?.[0]?.map((category) => ({ title: category.name, handle: "categories/" + category.handle }));
    }
    if (type === "product") {
      delete query?.type;
      const products = await this.productService_.list(query?.title ? { q: query?.title } : {});
      result = products?.map((product) => ({ title: product.title, handle: "products/" + product.handle }));
    }
    if (type === "page") {
      delete query?.type;
      const pages = await this.pageService_.listAndCount(query?.title ? { title: ILike(`%${query?.title}%`) } : {});
      result = pages[0]?.map((product) => ({ title: product.title, handle: product.link }));
    }
    return result;
  }

  async updateMenu(data: UpdateMenuDto[]): Promise<boolean> {
    const menuRepository = this.activeManager_.withRepository(this.menuRepository_);
    await menuRepository.save(data);
    return true;
  }

  async createMenu(data: UpdateMenuDto): Promise<boolean> {
    const menuRepository = this.activeManager_.withRepository(this.menuRepository_);
    const count = await menuRepository.count();
    const menu = menuRepository.create({ ...data, order: count });
    await menuRepository.save(menu);
    return true;
  }

  async deleteOne(id: string): Promise<boolean> {
    const menuRepository = this.activeManager_.withRepository(this.menuRepository_);
    await menuRepository.delete(id);
    return true;
  }
}

export default MenuService;
