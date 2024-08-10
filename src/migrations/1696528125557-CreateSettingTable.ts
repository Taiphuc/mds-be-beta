import { generateEntityId } from '@medusajs/utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingTable1696528125557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "setting" (
        "id" character varying NOT NULL PRIMARY KEY,
        "number_vip_mail_condition" integer DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );

    await queryRunner.query(
      `INSERT INTO "setting" ("id", "number_vip_mail_condition") values ('${generateEntityId(
        '',
        'set'
      )}', 100);`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
