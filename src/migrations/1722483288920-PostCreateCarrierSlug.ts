import { MigrationInterface, QueryRunner } from "typeorm"

export class PostCreateCarrierSlug1722483288920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS carrier_slug (
            "id" character varying NOT NULL PRIMARY KEY,
            "name" character varying NOT NULL,
            "slug" VARCHAR(50),
            "link" character varying NOT NULL,
            "body" character varying DEFAULT NULL,
            "active" BOOL DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        await queryRunner.query(`ALTER TABLE "order"
    ADD COLUMN "tracking" JSONB;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carrier_slug"`);
        await queryRunner.query(
            `ALTER TABLE "order"
        DROP COLUMN IF EXISTS "tracking";`
        );
    }
}
