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

@Entity('payment_setting')
export class PaymentSetting extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  public_key: string;

  @Column()
  secret_key: string;

  @Column()
  webhook_id: string;

  @Column()
  is_sanbox: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'payment_setting');
  }
}
