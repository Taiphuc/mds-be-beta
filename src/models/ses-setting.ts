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

@Entity('ses_setting')
export class SesSetting extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  region: string;

  @Column()
  key_id: string;

  @Column()
  access_key: string;

  @Column()
  from: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'ses_setting');
  }
}
