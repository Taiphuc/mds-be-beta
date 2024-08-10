import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateEntityId } from '@medusajs/utils';

export class CreateSesSettingTable1695145614872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ses" (
            "id" character varying NOT NULL PRIMARY KEY,
            "region" character varying NULL,
            "key_id" character varying NULL,
            "access_key" character varying NULL,
            "from" character varying NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )`
    );

    await queryRunner.query(
      `INSERT INTO "ses" ("id") values ('${generateEntityId('', 'ses')}');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ses"`);
  }
}
