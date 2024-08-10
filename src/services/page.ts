import { FindConfig, Selector, TransactionBaseService, buildQuery } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { UpdatePageDto } from "src/types/dto/updatePageDto";
import PageRepository from "src/repositories/page";
import { Page } from "src/models/page";

type InjectedDependencies = {
  manager: EntityManager;
  pageRepository: typeof PageRepository;
};

class PageService extends TransactionBaseService {
  protected pageRepository_: typeof PageRepository;

  constructor({ pageRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.pageRepository_ = pageRepository;
  }

  async listAndCount(
    selector?: Selector<Page>,
    config: FindConfig<Page> = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<[Page[], number]> {
    const postRepo = this.activeManager_.withRepository(this.pageRepository_);
    const query = buildQuery(selector, config);
    return postRepo.findAndCount(query);
  }


  async findById(id: string): Promise<Page> {
    const postRepo = this.activeManager_.withRepository(this.pageRepository_);

    return postRepo.findOne({ where: { code: id } });
  }

  async getByCode(code: string): Promise<Page> {
    const postRepo = this.activeManager_.withRepository(this.pageRepository_);

    return postRepo.findOne({ where: { code }, order: { created_at: 'ASC' } });
  }

  async updateOne(data: UpdatePageDto[]): Promise<boolean> {
    const pageRepository = this.activeManager_.withRepository(this.pageRepository_);
    await pageRepository.save(data);
    return true;
  }

  async createPage(data: UpdatePageDto): Promise<boolean> {
    const menuRepository = this.activeManager_.withRepository(this.pageRepository_);
    const count = await menuRepository.count();
    const menu = menuRepository.create(data);
    await menuRepository.save(menu);
    return true;
  }

  async deleteOne(id: string): Promise<boolean> {
    const pageRepository = this.activeManager_.withRepository(this.pageRepository_);
    await pageRepository.delete(id);
    return true;
  }
}

export default PageService;
