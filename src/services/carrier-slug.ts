import {FindConfig, Selector, TransactionBaseService, buildQuery} from "@medusajs/medusa";
import {EntityManager} from "typeorm";
import {UpdatePageDto} from "src/types/dto/updatePageDto";
import CarrierSlugRepository from "src/repositories/carrier-slug";
import {CarrierSlug} from "src/models/carrier-slug";

type InjectedDependencies = {
    manager: EntityManager;
    carrierSlugRepository: typeof CarrierSlugRepository;
};

class CarrierSlugService extends TransactionBaseService {
    protected carrierSlugRepository_: typeof CarrierSlugRepository;

    constructor({carrierSlugRepository}: InjectedDependencies) {
        super(arguments[0]);
        this.carrierSlugRepository_ = carrierSlugRepository;
    }

    async listAndCount(
        selector?: Selector<CarrierSlug>,
        config: FindConfig<CarrierSlug> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<CarrierSlug[]> {
        const postRepo = this.activeManager_.withRepository(this.carrierSlugRepository_);
        const query = buildQuery(selector, config);
        return postRepo.find(query);
    }

    async findOneById(id: string): Promise<CarrierSlug> {
        const postRepo = this.activeManager_.withRepository(this.carrierSlugRepository_);
        return postRepo.findOneById(id);
    }


    async updateTrackingNumber(order_id: string, data_tracking: any) {
        try {
            await this.manager_.query(
                `UPDATE "order"
       SET tracking = $1
       WHERE id = $2;`,
                [JSON.stringify(data_tracking), order_id]
            );
            return true;
        } catch (error) {
            console.error("GET REVIEW ERROR ::::", error);
            throw new Error("GET REVIEW ERROR");
        }
    }

    async updateOne(data: UpdatePageDto[]): Promise<boolean> {
        const pageRepository = this.activeManager_.withRepository(this.carrierSlugRepository_);
        await pageRepository.save(data);
        return true;
    }

    async createCarrierSlug(data: UpdatePageDto): Promise<boolean> {
        const menuRepository = this.activeManager_.withRepository(this.carrierSlugRepository_);
        const menu = menuRepository.create(data);
        await menuRepository.save(menu);
        return true;
    }

    async deleteOne(id: string): Promise<boolean> {
        const pageRepository = this.activeManager_.withRepository(this.carrierSlugRepository_);
        await pageRepository.delete(id);
        return true;
    }
}

export default CarrierSlugService;
