import { Customer, generateEntityId } from "@medusajs/medusa";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Theme } from "./theme";

@Entity("point")
export class Point extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({type: 'int', default: 0})
  point: number;

  @Column()
  type: string;

  @Column({default: null})
  message: string;

  @Column({type: 'jsonb', default: null})
  metadata: string;

  @Column({name: 'customer_id'})
  customerId: string;
  @ManyToOne(()=> Customer,{onDelete: "CASCADE"})
  @JoinColumn({name: 'customer_id'})
  customer: Customer;
  
  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "point");
  }
}
