import { MigrationInterface, QueryRunner } from "typeorm"

export class AddSettingsOfPoint1705551369545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO settings ("key", "value", "scope", "type")
            VALUES 
                ( 'vip_member_points', '1000', 'store', 'point'),
                ( 'vip_money_to_point_ratio', '1.5', 'store', 'point'),
                ( 'normal_member_money_to_point_ratio', '1', 'store', 'point'),
                ( 'point_to_money_ratio', '100', 'store', 'point');
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM settings WHERE type IN ('point');
        `);
    }

}
