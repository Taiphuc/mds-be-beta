import { Customer, Product } from "@medusajs/medusa";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CustomProductBase } from "./custom-product-base";

@Entity("custom_product")
export class CustomProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "product_id" })
  productId?: string;
  @ManyToOne(() => Product, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id' })
  product?: Product

  @Column({ name: "customer_id" })
  customerId?: string;
  @ManyToOne(() => Customer, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'customer_id',  })
  customer?: Customer

  @Column({ name: "product_base_id" })
  productBaseId?: string;
  @ManyToOne(() => CustomProductBase, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_base_id' })
  productBase?: CustomProductBase

  @Column({ name: "image" })
  image?: string;

  @Column({ type: 'jsonb', default: {} })
  metadata?: any;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
