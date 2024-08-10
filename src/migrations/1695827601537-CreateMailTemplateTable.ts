import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMailTemplateTable1695827601537
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mail_template" (
            "id" character varying NOT NULL PRIMARY KEY,
            "title" character varying NOT NULL,
            "data" text NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE NULL
            )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mail_template"`);
  }
}
