import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("option_page")
export class OptionPage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    key: string;

    @Column({ type: "text", default: {} })
    value: {};

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "option_page");
    }
}
