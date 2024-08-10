import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSkuForProductVariantTable1692715470396
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS product_variant DROP COLUMN IF EXISTS sku;`
    );
    await queryRunner.query(
      `ALTER TABLE product_variant ADD COLUMN sku VARCHAR(100) DEFAULT NULL;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
