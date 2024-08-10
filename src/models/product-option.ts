import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    ProductOption as MedusaProductOption,
    ProductOptionValue,
} from '@medusajs/medusa';
import { Product } from './product';

@Entity()
export class ProductOption extends MedusaProductOption {
    @Column()
    title: string;

    @Column({ type: 'jsonb', default: {} })
    metadata: any;

    @ManyToOne(() => Product, (product) => product.variants)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @OneToMany(() => ProductOptionValue, (value) => value.option)
    values: ProductOptionValue[];
}