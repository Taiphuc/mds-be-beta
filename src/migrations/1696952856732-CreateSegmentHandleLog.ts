import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSegmentHandleLog1696952856732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "segment_handle_log" (
        "id" character varying NOT NULL PRIMARY KEY,
        "segment_id" character varying DEFAULT NULL REFERENCES segment(id),
        "cart_id" character varying DEFAULT NULL REFERENCES cart(id),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "segment_handle_log"`);
  }
}
