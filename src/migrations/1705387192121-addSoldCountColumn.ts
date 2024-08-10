import { MigrationInterface, QueryRunner } from "typeorm"

export class AddSoldCountColumn1705387192121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN sold_count INTEGER DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD COLUMN sold_count INTEGER DEFAULT 0;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE product
              DROP COLUMN IF EXISTS sold_count;`
          );
        await queryRunner.query(
            `ALTER TABLE product_variant
              DROP COLUMN IF EXISTS sold_count;`
          );
    }

}
