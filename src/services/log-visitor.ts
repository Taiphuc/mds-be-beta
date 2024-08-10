import { MedusaRequest, TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import LogVisitorRepository from "../repositories/log-visitor";

type InjectedDependencies = {
  manager: EntityManager;
  logVisitorRepository: typeof LogVisitorRepository;
};

class LogVisitorService extends TransactionBaseService {
  protected logVisitorRepository_: typeof LogVisitorRepository;

  constructor({ manager, logVisitorRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.logVisitorRepository_ = manager.withRepository(logVisitorRepository);
  }

  async update(req: MedusaRequest, productId: string): Promise<boolean> {
    let record = await this.logVisitorRepository_.findOne({ where: { ip: req?.ip } })
    const currentTime = new Date();
    if (!record) {
      record = await this.logVisitorRepository_.save({ ip: req?.ip, context: req?.get('user-agent'), products: [{ id: productId, viewCount: 1, created_at: currentTime, update: currentTime }] })
    } else {
      let key = -1
      const product = record?.products?.find((p, i) => {
        if (
          p.id === productId
        ) {
          key = i;
          return true;
        }
        return false;
      });
      if (product) {
        record.products[key] = { ...record.products[key], viewCount: record.products[key]?.viewCount + 1, updated_at: currentTime}
      } else {
        record?.products?.push({ id: productId, viewCount: 1, created_at: currentTime, updated_at: currentTime});
      }
      await this.logVisitorRepository_.save(record)
    }
    return true
  }
}

export default LogVisitorService;
