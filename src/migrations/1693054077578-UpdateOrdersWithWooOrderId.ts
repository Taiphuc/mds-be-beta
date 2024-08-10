import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrdersWithWooOrderId1693054077578
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD COLUMN woo_order_id INTEGER DEFAULT NULL, ADD COLUMN domain VARCHAR(255) DEFAULT NULL, ADD COLUMN woo_sync_status VARCHAR(255) DEFAULT NULL, ADD CONSTRAINT unique_woo_order_domain UNIQUE(woo_order_id, domain)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order"
        DROP CONSTRAINT IF EXISTS unique_woo_order_domain,
        DROP COLUMN IF EXISTS woo_order_id,
        DROP COLUMN IF EXISTS domain,
        DROP COLUMN IF EXISTS woo_sync_status;`
    );
  }
}
