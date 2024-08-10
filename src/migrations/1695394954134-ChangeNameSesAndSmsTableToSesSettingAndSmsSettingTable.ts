import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNameSesAndSmsTableToSesSettingAndSmsSettingTable1695394954134
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(`ALTER TABLE sms RENAME TO sms_setting;`),
      queryRunner.query(`ALTER TABLE ses RENAME TO ses_setting;`),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(`ALTER TABLE sms_setting RENAME TO sms;`),
      queryRunner.query(`ALTER TABLE ses_setting RENAME TO ses;`),
    ]);
  }
}
