import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStyleForProductTable1694534965627
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN style VARCHAR(255) DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE product DROP COLUMN IF EXISTS style;`);
  }
}
