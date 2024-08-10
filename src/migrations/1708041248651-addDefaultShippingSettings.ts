import { SETTING_TYPES } from "../utils/const/settings";
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddDefaultShippingSettings1708041248651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO settings ("key", "value", "scope", "type")
            VALUES 
                ( 'default_shipping_time', '2-7', 'admin', '${SETTING_TYPES.shipping}');
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM settings WHERE type IN ('${SETTING_TYPES.shipping}');
    `);
    }

}
