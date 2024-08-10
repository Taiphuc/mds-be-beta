import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductsSyncToMerchant1699971698843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN sync_to_merchant BOOL DEFAULT TRUE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `ALTER TABLE product
        DROP COLUMN IF EXISTS sync_to_merchant;`
      );
  }
}
