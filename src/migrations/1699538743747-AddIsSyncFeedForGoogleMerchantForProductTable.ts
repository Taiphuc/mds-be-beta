import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSyncFeedForGoogleMerchantForProductTable1699538743747
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN is_sync_feed_for_google_merchant BOOL DEFAULT FALSE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE product DROP COLUMN IF EXISTS is_sync_feed_for_google_merchant;`
    );
  }
}
