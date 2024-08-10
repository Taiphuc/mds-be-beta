import { TransactionBaseService } from "@medusajs/medusa";
import OptionPageRepository from "src/repositories/option-page";
import { TCreateOptionPage } from "src/types/dto/optionPage";
import { EntityManager, In } from "typeorm";

type InjectedDependencies = {
    manager: EntityManager;
    optionPageRepository: typeof OptionPageRepository;
};


class OptionPageService extends TransactionBaseService {
    protected optionPageRepository_: typeof OptionPageRepository;

    constructor({ optionPageRepository }: InjectedDependencies) {
        super(arguments[0]);
        this.optionPageRepository_ = optionPageRepository;
    }

    async create(payload: TCreateOptionPage) {
        try {
            const optionPageRepository =
                this.manager_.withRepository(this.optionPageRepository_);
            const optionPage = optionPageRepository.create(payload)
            await optionPageRepository.save(optionPage)
        } catch (error) {
            throw new Error(`Failed to create option`);
        }
    }

    async list(params: { limit: number, offset: number }) {
        const optionPageRepository =
            this.manager_.withRepository(this.optionPageRepository_);
        try {
            const {
                limit,
                offset,
            } = params;

            const listOptionPages = await optionPageRepository.findAndCount({ skip: offset, take: limit })
            return { option_pages: listOptionPages[0], count: listOptionPages[1] }
        }
        catch (error) {
            throw new Error(`Failed to find options`);
        }
    }

    async findByKey(keys: string[]) {
        const optionPageRepository =
            this.manager_.withRepository(this.optionPageRepository_);
        if (keys.length === 0) {
            return [];
        }
        try {
            const listOptionPages = await optionPageRepository.findBy({
                key: In(keys),
            });
            return listOptionPages;
        }
        catch (error) {
            throw new Error(`Failed to find option by keys: ${keys}`);
        }
    }

    async updateByKey(key: string, value: Record<string, any>) {
        const optionPageRepository =
            this.manager_.withRepository(this.optionPageRepository_);
        if (!value) return
        try {
            const result = await optionPageRepository.update(
                { key },
                { value }
            );

            if (result.affected === 0) {
                throw new Error(`No record found with key: ${key}`);
            }
            return result;
        }
        catch (error) {
            throw new Error(`Failed to update value for key: ${key}`);
        }

    }
}

export default OptionPageService;