import { generateEntityId } from '@medusajs/medusa';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('segment_handle_log')
export class SegmentHandleLog extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'segment_id' })
  segmentId: string;

  @Column({ name: 'cart_id' })
  cartId: string;

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  beforeInsert(): void {
    this.id = generateEntityId('', 'seg_log');
  }
}
