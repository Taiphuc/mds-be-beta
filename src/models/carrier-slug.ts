import { generateEntityId } from "@medusajs/medusa";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("carrier_slug")
export class CarrierSlug extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    slug: string;

    @Column()
    link: string;

    @Column()
    body: string;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "carrier_slug");
    }
}
