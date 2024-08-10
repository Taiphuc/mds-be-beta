import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Page } from "./page";

@Entity("theme")
export class Theme extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", default: null })
  metadata: {};

  @Column({ type: "jsonb", default: null })
  settings: {
    color: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
    }
  };

  @OneToMany(() => Page, page => page.theme)
  pages: Page[];

  @Column({ type: "bool", default: false })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
