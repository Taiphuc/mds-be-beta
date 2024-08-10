import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingsTable1700396265802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` CREATE TABLE IF NOT EXISTS settings (
        id serial NOT NULL PRIMARY KEY,
        key character varying NOT NULL,
        value character varying NOT NULL,
        scope character varying NOT NULL DEFAULT 'store',
        type character varying NOT NULL
    )`
    );
    await queryRunner.query(
      `INSERT INTO "settings" ("key","value","scope","type") 
        values 
            ('display', '1', 'store', 'review'),
            ('customerOnlyPostReview', '1', 'store', 'review'),
            ('newReviewIsDraft', '1', 'store', 'review'),
            ('numberReviewPerPage', '10', 'store', 'review');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settings"`);
  }
}
 