import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateEntityId } from '@medusajs/utils';

export class CreateSmsSettingTable1695145614872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sms" (
            "id" character varying NOT NULL PRIMARY KEY,
            "account_sid" character varying NULL,
            "auth_token" character varying NULL,
            "from_number" character varying NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )`
    );

    await queryRunner.query(
      `INSERT INTO "sms" ("id") values ('${generateEntityId('', 'sms')}');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sms"`);
  }
}
