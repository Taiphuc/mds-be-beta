import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { SizeGuide } from "./size-guide";
import { ProductVariant as MedusaProductVariant } from "@medusajs/medusa";
import { Product } from "./product";
import { Image } from "./image";

@Entity()
export class ProductVariant extends MedusaProductVariant {
  @Column({ name: 'sold_count', type: 'int', default: 0 })
  soldCount?: number;

  @Column({ name: "size_guide_id" })
  sizeGuideId: number;
  @ManyToOne(() => SizeGuide, { createForeignKeyConstraints: false })
  @JoinColumn({ name: "size_guide_id" })
  sizeGuide: SizeGuide;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToMany(() => Image, image => image.variants)
  @JoinTable({
    name: "product_variant_images",
    joinColumn: {
      name: "variant_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id"
    }
  })
  images: Image[];
}
