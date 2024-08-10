import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SizeGuide } from './size-guide';
import { ProductTag as MedusaProductTag } from '@medusajs/medusa';

@Entity()
export class ProductTag extends MedusaProductTag {
  @Column({ name: 'size_guide_id' })
  sizeGuideId: number;
  @ManyToOne(() => SizeGuide, { createForeignKeyConstraints: false })
  @JoinColumn({name: 'size_guide_id'})
  sizeGuide: SizeGuide;
}
