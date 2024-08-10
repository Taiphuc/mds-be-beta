import { generateEntityId } from '@medusajs/medusa';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('google_merchant_setting')
export class GoogleMerchantSetting extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  merchant_id: string;

  @Column()
  client_email: string;

  @Column()
  private_key: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'gg_m');
  }
}
