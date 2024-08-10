import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSegmentTable1696748736614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "segment" (
        "id" character varying NOT NULL PRIMARY KEY,
        "title" character varying DEFAULT NULL,
        "condition" character varying DEFAULT NULL,
        "time_type" character varying DEFAULT NULL,
        "time_value" integer DEFAULT NULL,
        "mail_to" character varying DEFAULT NULL,
        "mail_subject" character varying DEFAULT NULL,
        "mail_heading" character varying DEFAULT NULL,
        "mail_preheader" character varying DEFAULT NULL,
        "mail_content" character varying DEFAULT NULL,
        "template_normal_id" character varying DEFAULT NULL REFERENCES mail_template(id),
        "template_vip_id" character varying DEFAULT NULL REFERENCES mail_template(id),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE NULL
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "segment"`);
  }
}
