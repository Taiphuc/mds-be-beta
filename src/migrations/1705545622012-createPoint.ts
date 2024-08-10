import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePoint1705545622012 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "point" (
            id serial NOT NULL PRIMARY KEY,
            point integer NOT NULL DEFAULT 0,
            type character varying NOT NULL,
            message character varying DEFAULT null,
            metadata jsonb DEFAULT null,
            customer_id character varying NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "FK_point_customer" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE
            );
        `);

        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD COLUMN "point" bigint NOT NULL DEFAULT 0,
            ADD COLUMN "total_purchased" bigint NOT NULL DEFAULT 0;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "point";`);
        await queryRunner.query(`
            ALTER TABLE "customer"
            DROP COLUMN "point",
            DROP COLUMN "total_purchased";
        `);
    }

}
