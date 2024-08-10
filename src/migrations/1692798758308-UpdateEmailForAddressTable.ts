import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmailForAddressTable1692798758308
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ADD COLUMN email VARCHAR(255) DEFAULT NULL, ADD COLUMN state VARCHAR(100) DEFAULT NULL;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE customer
          DROP COLUMN IF EXISTS email,
          DROP COLUMN IF EXISTS state;`
    );
  }
}
