import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateThemeTable1702719983892 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS theme (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                metadata JSONB DEFAULT NULL,
                settings JSONB DEFAULT NULL,
                status BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `);

        await queryRunner.query(`
            ALTER TABLE page ADD COLUMN theme_id INTEGER DEFAULT NULL;
            `);

        await queryRunner.query(`
            ALTER TABLE page
            ADD CONSTRAINT fk_page_theme
            FOREIGN KEY (theme_id)
            REFERENCES theme(id);
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.query(`
        ALTER TABLE page DROP CONSTRAINT fk_page_theme;
        `);

        await queryRunner.query(`
        ALTER TABLE page DROP COLUMN theme_id;
        `);

        await queryRunner.query(`DROP TABLE IF EXISTS themes`);
    }

}
