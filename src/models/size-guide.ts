import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductCollection } from "./collection";
import { ProductTag } from "./tag";
import { ProductVariant } from "./variant";
import { Product } from "./product";

@Entity("size_guide")
export class SizeGuide extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", name: "top_text" })
  topText: string;

  @Column({ comment: "size table", type: "text" })
  content: string;

  @Column({ type: "text", name: "bottom_text" })
  bottomText: string;

  @Column({ type: "boolean", default: false })
  status: boolean;

  @OneToMany(() => Product, (product) => product.sizeGuide)
  products: Product[];

  @OneToMany(() => ProductVariant, (variant) => variant.sizeGuide)
  variants: ProductVariant[];

  @OneToMany(() => ProductTag, (tag) => tag.sizeGuide)
  tags: ProductTag[];

  @OneToMany(() => ProductCollection, (collection) => collection.sizeGuide)
  collections: ProductCollection[];
}
