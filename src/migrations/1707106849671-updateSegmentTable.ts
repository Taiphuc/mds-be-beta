import { generateEntityId } from "@medusajs/medusa";
import { MAIL_TEMPLATES_AND_TYPES } from "../utils/const/mail";
import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateSegmentTable1707106849671 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "segment" ADD COLUMN is_active BOOL DEFAULT FALSE;`
        );

        await queryRunner.query(`
        INSERT INTO mail_template (id, title, data, created_at, updated_at)
        VALUES 
            (
                '${generateEntityId("", "template")}', 
                '${MAIL_TEMPLATES_AND_TYPES.subscribe_new_product_mail}', 
                CONCAT(
                    '<!DOCTYPE html><html lang="en>',
                    '<head>',
                        '<meta charset="UTF-8">',
                        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                        '<title>Document</title>',
                    '</head>',
                    '<body>',
                        '{{ mail_heading }}',
                        '{{ mail_preheader }}',
                        '{{ mail_content }}',
                        '{{ mail_content }}',
                        '{{ product_name }}',
                        '{{ product_thumbnail }}',
                        '{{ product_amount }}',
                        '{{ product_link }}',
                    '</body>',
                    '</html>'
                ), 
                NOW(), 
                NOW()
            );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE segment DROP COLUMN IF EXISTS is_active;`
        );

        await queryRunner.query(`
        DELETE FROM mail_template WHERE title = '${MAIL_TEMPLATES_AND_TYPES.subscribe_new_product_mail}';
        `);
    }

}
