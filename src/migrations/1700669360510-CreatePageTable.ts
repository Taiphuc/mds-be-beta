import { generateEntityId } from "@medusajs/medusa";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePageTable1700669360510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS page (
        "id" character varying NOT NULL PRIMARY KEY,
        "title" character varying NOT NULL,
        "code" VARCHAR(50),
        "link" character varying NOT NULL,
        "metadata" character varying DEFAULT NULL,
        "body" character varying DEFAULT NULL,
        "active" BOOL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await queryRunner.query(`
    INSERT INTO page (id, title, code, link, metadata, created_at, updated_at)
    VALUES 
        ('${generateEntityId("", "page")}', 'Home', 'home', '', 'page Home', NOW(), NOW()),
        ('${generateEntityId("", "page")}', 'About', 'about', 'about', 'page About', NOW(), NOW()),
        ('${generateEntityId("", "page")}', 'FAQ''s', 'faq', 'faq', 'page FAQs', NOW(), NOW()),
        ('${generateEntityId("", "page")}', 'Contact', 'contact-us', 'contact', 'page Contact', NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "page"`);
  }
}
