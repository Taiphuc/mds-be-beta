import { generateEntityId } from "@medusajs/medusa";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("menu")
export class Menu extends BaseEntity {
  @PrimaryColumn()
  id?: string;

  @Column()
  title?: string;

  @Column({ nullable: true, default: null })
  link?: string;

  @Index()
  @Column()
  order?: number;

  @Column({ nullable: true })
  parent_id?: string;
  @ManyToOne(() => Menu, { createForeignKeyConstraints: false })
  @JoinColumn({ name: "parent_id" })
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children?: Menu[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "menu");
  }
}
