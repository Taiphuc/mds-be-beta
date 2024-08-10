import { MigrationInterface, QueryRunner } from "typeorm"

export class AddSettingsFulfillmentPrintful1706543673776 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO settings ("key", "value", "scope", "type")
            VALUES 
                ( 'printful_access_token', '', 'admin', 'fulfillment'),
                ( 'printful_store_id', '', 'admin', 'fulfillment'),
                ( 'printful_enable_webhooks', '1', 'admin', 'fulfillment'),
                ( 'printful_enable_sync', '1', 'admin', 'fulfillment'),
                ( 'printful_product_tags', '1', 'admin', 'fulfillment'),
                ( 'printful_product_categories', '1', 'admin', 'fulfillment'),
                ( 'printful_confirm_order', '1', 'admin', 'fulfillment'),
                ( 'printful_batch_size', '1', 'admin', 'fulfillment');
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM settings WHERE type IN ('fulfillment');
    `);
    }

}
