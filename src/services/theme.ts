import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager, In } from "typeorm";
import { GetSizeGuideDto } from "../types/dto/sizeGuideDto";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import ThemeRepository from "../repositories/theme";
import { CreateThemeDto } from "../types/dto/themeDto";
import PageRepository from "../repositories/page";
import { Page } from "../models/page";
import { MedusaError } from "medusa-core-utils";

type InjectedDependencies = {
  manager: EntityManager;
  themeRepository: typeof ThemeRepository;
  pageRepository: typeof PageRepository;
};

class ThemeService extends TransactionBaseService {
  protected themeRepository_: typeof ThemeRepository;
  protected pageRepository_: typeof PageRepository;

  constructor({ themeRepository, manager }: InjectedDependencies) {
    super(arguments[0]);
    this.themeRepository_ = manager.withRepository(themeRepository);
    this.pageRepository_ = manager.withRepository(PageRepository);
  }

  async retrieve(payload: GetSizeGuideDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);
    const res = await this.themeRepository_.findAndCount({
      take: limit,
      skip,
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);
    return { data, count, total, page, pageCount };
  }

  async getOne(id: number | any) {
    const theme = await this.themeRepository_.findOne({ where: { id: id || 0 }, relations: ["pages"] });
    return theme;
  }
  
  async getDefaultSetting() {
    const theme = await this.themeRepository_.findOne({ where: { status: true } });
    return theme;
  }

  async create(payload: CreateThemeDto) {
    let pages: Page[] = [];
    if (payload?.pages?.length > 0) {
      pages = await this.pageRepository_.find({ where: { id: In(payload?.pages) } });
    }
    const theme = await this.themeRepository_.save({
      name: payload.name,
      pages,
      settings: payload.settings,
      metadata: payload.metadata,
      status: payload.status,
    });
    return theme;
  }

  async update(payload: CreateThemeDto) {
    const theme = await this.themeRepository_.findOne({ where: { id: payload?.id || 0 } });
    if (!theme) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Theme not found");
    }
    let pages: Page[] = [];
    if (payload?.pages?.length > 0) {
      pages = await this.pageRepository_.find({ where: { id: In(payload?.pages) } });
    }
    if (payload?.status) {
      const defaultTheme = await this.themeRepository_.findOne({ where: { status: true } });
      if (defaultTheme) await this.themeRepository_.save({ ...defaultTheme, status: false });
    }

    const result = await this.themeRepository_.save({
      id: payload.id,
      name: payload.name,
      pages,
      metadata: payload.metadata,
      settings: payload.settings,
      status: payload.status,
    });
    return result;
  }

  async duplicate(id: number) {
    const theme = await this.themeRepository_.findOne({ where: { id: id || 0 }, relations: ["pages"] });
    if (!theme) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Theme not found");
    }
    delete theme.id;
    const newTheme = await this.themeRepository_.save(theme);
    const pages = theme?.pages?.map((e) => {
      const { id, created_at, updated_at, ...result } = e;
      return { ...result, themeId: newTheme.id };
    });
    const savedPages = await this.pageRepository_.save(pages);
    const result = await this.themeRepository_.save({ ...theme, pages: savedPages });
    return result;
  }

  async delete(id: number) {
    return await this.themeRepository_.delete(id);
  }
}

export default ThemeService;
