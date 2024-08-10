import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateDataSettingStorage1703924430671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO settings ("key", "value", "scope", "type")
    VALUES 
        ( 'upload_target', 'local', 'admin', 'storage'),
        ( 'bucket', '', 'admin', 's3Config'),
        ( 's3_url', '', 'admin', 's3Config'),
        ( 'secret_access_key', '', 'admin', 's3Config'),
        ( 'region', '', 'admin', 's3Config'),
        ( 'endpoint', '', 'admin', 's3Config'),
        ( 'access_key_id', '', 'admin', 's3Config'),
        ( 'upload_dir', 'uploads', 'admin', 'localStorage'),
        ( 'backend_url', 'http://localhost:9000', 'admin', 'localStorage'),
        ( 'bucket', '', 'admin', 'digitalOceanSpace'),
        ( 'spaces_url', '', 'admin', 'digitalOceanSpace'),
        ( 'secret_access_key', '', 'admin', 'digitalOceanSpace'),
        ( 'region', '', 'admin', 'digitalOceanSpace'),
        ( 'endpoint', '', 'admin', 'digitalOceanSpace'),
        ( 'access_key_id', '', 'admin', 'digitalOceanSpace');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM settings WHERE type IN ('s3Config', 'localStorage', 'digitalOceanSpace', 'storage');
    `);
  }
}
