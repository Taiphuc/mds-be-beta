import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductVariant } from "./variant";
import { Image } from "./image";

@Entity()
export class ProductVariantImage {
    @PrimaryColumn()
    variant_id: string;

    @PrimaryColumn()
    image_id: string;

    @ManyToOne(() => ProductVariant, variant => variant.images)
    variant: ProductVariant;

    @ManyToOne(() => Image, image => image.variants)
    image: Image;
}