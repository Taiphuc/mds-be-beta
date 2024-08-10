import { Product } from "@medusajs/medusa";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("custom_product_base")
export class CustomProductBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "product_id", default: null })
  productId?: string;
  @OneToOne(() => Product, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id' })
  product?: Product

  @Column({ name: 'template_data', type: 'jsonb', default: {} })
  templateData?: any;

  @Column({ name: 'print_file_data', type: 'jsonb', default: {} })
  printFileData?: any;

  @Column({ type: 'jsonb', default: {} })
  metadata?: any;

  @Column({ type: 'jsonb', default: {} })
  template?: any;

  @Column({ type: 'jsonb', default: {} })
  layers?: any;

  @Column()
  thumbnail?: string;

  @Column({ name: 'external_id', default: null })
  externalId?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
