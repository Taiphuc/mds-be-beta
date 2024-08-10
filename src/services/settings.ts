import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager, FindOptionsWhere } from "typeorm";
import SettingsRepository from "src/repositories/settings";
import { GetSettingsDto } from "src/types/dto/getSettings.dto";
import { Settings } from "src/models/settings";
import { remakeSettings } from "../utils/remakeSettings";
import { UpdateSettingsDto } from "src/types/dto/updateSettings";

type InjectedDependencies = {
  manager: EntityManager;
  settingsRepository: typeof SettingsRepository;
};

class SettingsService extends TransactionBaseService {
  protected settingsRepository_: typeof SettingsRepository;

  constructor({ settingsRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.settingsRepository_ = settingsRepository;
  }

  async retrieve({ scope = "store", type }: GetSettingsDto) {
    const settingsRepo = this.activeManager_.withRepository(this.settingsRepository_);
    const filter: FindOptionsWhere<Settings> = {};
    if (type) {
      filter.type = type;
    }
    if (scope === "store") {
      filter.scope = scope;
    }
    const settings = await settingsRepo.find({ where: filter });

    const result = remakeSettings(settings);
    return result;
  }

  async create({ type = "staticContent", key, value }) {
    const settingsRepo = this.activeManager_.withRepository(this.settingsRepository_);
    const new_setting = await settingsRepo.save({ type, key, value, scope: "store" })
    return new_setting
  }

  async update(data: UpdateSettingsDto[]): Promise<boolean> {
    const settingsRepo = this.activeManager_.withRepository(this.settingsRepository_);
    data = data?.map((d) => ({ id: d?.id, value: d?.value }));
    await settingsRepo.save(data);
    return true;
  }
}

export default SettingsService;
