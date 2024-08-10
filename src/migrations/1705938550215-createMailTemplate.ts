import { generateEntityId } from "@medusajs/utils";
import { MAIL_TEMPLATES_AND_TYPES } from "../utils/const/mail";
import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateMailTemplate1705938550215 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO mail_template (id, title, data, created_at, updated_at)
            VALUES 
                (
                    '${generateEntityId("", "template")}', 
                    '${MAIL_TEMPLATES_AND_TYPES.customer_reset_password}', 
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
                        '</body>',
                        '</html>'
                    ), 
                    NOW(), 
                    NOW()
                ),
                (
                    '${generateEntityId("", "template")}', 
                    '${MAIL_TEMPLATES_AND_TYPES.discount_mail}', 
                    CONCAT(
                        '<!DOCTYPE html>',
                        '<html lang="en">',
                        '<head>',
                            '<meta charset="UTF-8">',
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '<title>Document</title>',
                        '</head>',
                        '<body>',
                            '<p>{{ mail_heading }}</p>',
                            '<p>Congratulations you have received the discount:</p>',
                            '<p>Discount code is: {{ discount_code }}</p>',
                            '<p>Discount expiry date: {{ discount_expiry_date }}</p>',
                            '<p>{{ mail_content }}</p>',
                            '<p>{{ mail_preheader }}</p>',
                        '</body>',
                        '</html>'
                    ), 
                    NOW(), 
                    NOW()
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM mail_template WHERE title IN ('${MAIL_TEMPLATES_AND_TYPES.discount_mail}','${MAIL_TEMPLATES_AND_TYPES.customer_reset_password}');
        `);
    }

}
