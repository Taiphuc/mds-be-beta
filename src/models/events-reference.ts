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

@Entity('events_reference')
export class EventsReference extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  action: string;

  @Column()
  subject: string;

  @Column()
  template_normal: string;

  @Column()
  template_vip: string;

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  beforeInsert(): void {
    this.id = generateEntityId(this.id, 'event');
  }
}
