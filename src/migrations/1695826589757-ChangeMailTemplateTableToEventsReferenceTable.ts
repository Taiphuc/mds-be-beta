import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMailTemplateTableToEventsReferenceTable1695826589757
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE mail_template RENAME TO events_reference;`
      ),
      queryRunner.query(
        `UPDATE events_reference SET id = REPLACE(id, 'mail', 'event');`
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE events_reference RENAME TO mail_template;`
    );
  }
}
