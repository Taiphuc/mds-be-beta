import { Column, Entity } from 'typeorm';
import {
  // alias the core entity to not cause a naming conflict
  Order as MedusaOrder,
} from '@medusajs/medusa';

@Entity()
export class Order extends MedusaOrder {
  @Column()
  domain: string;

  @Column({ name: 'woo_order_id' })
  wooOrderId: number;

  @Column({ name: 'woo_sync_status' })
  wooSyncStatus: string;

  @Column({ name: 'tracking' })
  tracking: string;

}
