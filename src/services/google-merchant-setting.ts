import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import { GoogleMerchantSetting } from "../models/google-merchant-setting";
import GoogleMerchantSettingRepository from "../repositories/google-merchant-setting";
import * as path from "path";
import * as fs from "fs";

type InjectedDependencies = {
  manager: EntityManager;
  googleMerchantSettingRepository: typeof GoogleMerchantSettingRepository;
};

class GoogleMerchantSettingService extends TransactionBaseService {
  protected googleMerchantSettingRepository_: typeof GoogleMerchantSettingRepository;

  constructor({ googleMerchantSettingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.googleMerchantSettingRepository_ = googleMerchantSettingRepository;
  }

  async retrieve(): Promise<GoogleMerchantSetting> {
    const googleMerchantSettingRepo = this.activeManager_.withRepository(this.googleMerchantSettingRepository_);

    const result = await googleMerchantSettingRepo.find();
    return result[0];
  }

  async update(id, data): Promise<boolean> {
    const googleMerchantSettingRepo = this.activeManager_.withRepository(this.googleMerchantSettingRepository_);
    const filePath = path.join(process.cwd(), data?.private_key);
    const newFilePath = path.join(process.cwd(), process.env.GOOGLE_KEY_FILE);
    fs.renameSync(filePath, newFilePath);

    const result = await googleMerchantSettingRepo.findOne({ where: { id } });
    if (!result) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Google Merchant Setting Not Found");

    await googleMerchantSettingRepo.save({ ...result, ...data });
    return true;
  }
}

export default GoogleMerchantSettingService;
