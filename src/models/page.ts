import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Theme } from "./theme";

@Entity("page")
export class Page extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({unique: true})
  code: string;

  @Column()
  link: string;

  @Column()
  metadata: string;

  @Column()
  body: string;

  @Column({ default: true })
  active: boolean;

  @Column({name: 'theme_id'})
  themeId: number;
  @ManyToOne(()=> Theme,{onDelete: "CASCADE"})
  @JoinColumn({name: 'theme_id'})
  theme: Theme;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "page");
  }
}
