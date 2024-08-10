import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('product_shipping_profile')
export class ProductShippingProfile extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', insert: false, select: false, update: false })
  id: never;

  @Column()
  profile_id: string;

  @Column()
  product_id: string;
}
