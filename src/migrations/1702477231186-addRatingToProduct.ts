import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRatingToProduct1702477231186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN rating INTEGER DEFAULT 0;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE product
        DROP COLUMN IF EXISTS rating;`
    );
  }
}
