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

@Entity('sms_setting')
export class SmsSetting extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  account_sid: string;

  @Column()
  auth_token: string;

  @Column()
  from_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'sms_setting');
  }
}
