import { generateEntityId } from '@medusajs/medusa';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoogleMerchantSettingTable1699886566656
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "google_merchant_setting" (
        "id" character varying NOT NULL PRIMARY KEY,
        "merchant_id" character varying NULL,
        "client_email" character varying NULL,
        "private_key" character varying NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );

    await Promise.all([
      queryRunner.query(
        `INSERT INTO "google_merchant_setting" ("id") values ('${generateEntityId(
          '',
          'gg_m'
        )}');`
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "google_merchant_setting"`);
  }
}
