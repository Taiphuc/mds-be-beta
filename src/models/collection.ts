import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SizeGuide } from './size-guide';
import { ProductCollection as MedusaProductCollection } from '@medusajs/medusa';

@Entity()
export class ProductCollection extends MedusaProductCollection {
  @Column({ name: 'size_guide_id' })
  sizeGuideId: number;
  @ManyToOne(() => SizeGuide, { createForeignKeyConstraints: false })
  @JoinColumn({name: 'size_guide_id'})
  sizeGuide: SizeGuide;
}
