import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("log-visitor")
export class LogVisitor extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  ip: string;

  @Column()
  context: string;

  @Column({ type: "jsonb", default: null })
  products: {
    id: string, viewCount: number,
    created_at: Date,
    updated_at: Date,
  }[]

  @Column()
  metadata: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "logV");
  }
}
