import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { SizeGuide } from "./size-guide";
import { Image as MedusaImage } from "@medusajs/medusa";
import { Product } from "./product";
import { ProductVariant } from "./variant";

@Entity()
export class Image extends MedusaImage {
    @PrimaryColumn()
    id: string;

    @Column()
    url: string;

    @Column({ type: 'jsonb', default: {} })
    metadata: any;

    @ManyToMany(() => ProductVariant, variant => variant.images)
    variants: ProductVariant[];
}