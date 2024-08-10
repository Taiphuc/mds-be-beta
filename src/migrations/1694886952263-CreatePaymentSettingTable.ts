import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateEntityId } from '@medusajs/utils';

export class CreatePaymentSettingTable1694886952263
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_setting" (
      "id" character varying NOT NULL PRIMARY KEY,
      "type" character varying NOT NULL,
      "public_key" character varying NULL,
      "secret_key" character varying NULL,
      "webhook_id" character varying NULL,
      "is_sanbox" boolean NOT NULL DEFAULT false,
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );

    await Promise.all([
      queryRunner.query(
        `INSERT INTO "payment_setting" ("id", "type") values ('${generateEntityId(
          '',
          'payment_setting'
        )}', 'paypal');`
      ),
      queryRunner.query(
        `INSERT INTO "payment_setting" ("id", "type") values ('${generateEntityId(
          '',
          'payment_setting'
        )}', 'stripe');`
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_setting"`);
  }
}
