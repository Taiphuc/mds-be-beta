import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsWithWooProductId1692347314597
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN woo_product_id INTEGER DEFAULT NULL, ADD COLUMN domain VARCHAR(255) DEFAULT NULL, ADD CONSTRAINT unique_woo_product_domain UNIQUE(woo_product_id, domain)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE product
      DROP CONSTRAINT IF EXISTS unique_woo_product_domain,
      DROP COLUMN IF EXISTS woo_product_id,
      DROP COLUMN IF EXISTS domain;`
    );
  }
}
