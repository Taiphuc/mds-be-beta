import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAddShippingProfileForProductTable1696532651549
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN is_add_shipping_profile BOOL DEFAULT FALSE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE product DROP COLUMN IF EXISTS is_add_shipping_profile;`
    );
  }
}
