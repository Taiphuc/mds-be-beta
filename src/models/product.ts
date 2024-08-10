import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct, ProductOption, ProductVariant,
} from '@medusajs/medusa';
import { SizeGuide } from './size-guide';

@Entity()
export class Product extends MedusaProduct {
  @Column({ default: null, nullable: true })
  style?: string;

  @Column({ name: 'is_add_shipping_profile', default: false })
  isAddShippingProfile?: boolean;

  @Column({ name: 'is_sync_feed_for_google_merchant', default: false })
  isSyncFeedForGoogleMerchant?: boolean;

  @Column({ nullable: true, default: null })
  domain?: string;

  @Column({ default: 0 })
  rating?: number;

  @Column({ name: 'woo_product_id', nullable: true, default: null })
  wooProductId?: number;

  @Column({ name: 'sync_to_merchant', type: 'boolean', default: true })
  syncToMerchant?: false;

  @Column({ name: 'sold_count', type: 'int', default: 0 })
  soldCount?: number;

  @Column({ name: 'size_guide_id' })
  sizeGuideId?: number;
  @ManyToOne(() => SizeGuide, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'size_guide_id' })
  sizeGuide?: SizeGuide;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductOption, (option) => option.product)
  options: ProductOption[]
}
