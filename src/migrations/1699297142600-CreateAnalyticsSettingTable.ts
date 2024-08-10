import { generateEntityId } from '@medusajs/medusa';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnalyticsSettingTable1699297142600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "analytics_setting" (
        "id" character varying NOT NULL PRIMARY KEY,
        "provider" character varying NULL,
        "id_provider" character varying NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );

    await Promise.all([
      queryRunner.query(
        `INSERT INTO "analytics_setting" ("id", "provider") values ('${generateEntityId(
          '',
          'analytics_setting'
        )}', 'Google Analytics');`
      ),
      queryRunner.query(
        `INSERT INTO "analytics_setting" ("id", "provider") values ('${generateEntityId(
          '',
          'analytics_setting'
        )}', 'Google Tag Manager');`
      ),
      queryRunner.query(
        `INSERT INTO "analytics_setting" ("id", "provider") values ('${generateEntityId(
          '',
          'analytics_setting'
        )}', 'Meta Pixel');`
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "analytics_setting"`);
  }
}
