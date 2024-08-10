import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCustomersWithWooCustomerId1692729656568
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" ADD COLUMN username VARCHAR(255) DEFAULT NULL, ADD COLUMN role VARCHAR(255) DEFAULT NULL, ADD COLUMN avatar VARCHAR(255) DEFAULT NULL, ADD COLUMN woo_customer_id INTEGER DEFAULT NULL, ADD COLUMN domain VARCHAR(255) DEFAULT NULL, ADD CONSTRAINT unique_woo_customer_domain UNIQUE(woo_customer_id, domain)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE customer
        DROP CONSTRAINT IF EXISTS unique_woo_customer_domain,
        DROP COLUMN IF EXISTS role,
        DROP COLUMN IF EXISTS username,
        DROP COLUMN IF EXISTS avatar,
        DROP COLUMN IF EXISTS woo_customer_id,
        DROP COLUMN IF EXISTS domain;`
    );
  }
}
