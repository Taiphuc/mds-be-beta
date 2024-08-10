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

@Entity('analytics_setting')
export class AnalyticsSetting extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  provider: string;

  @Column()
  id_provider: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'analytics_setting');
  }
}
