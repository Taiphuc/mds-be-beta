import { generateEntityId } from "@medusajs/medusa";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMenuTable1700669353315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS menu (
        "id" character varying NOT NULL PRIMARY KEY,
        "title" character varying NOT NULL,
        "link" character varying DEFAULT NULL,
        "order" integer NOT NULL,
        "parent_id" character varying DEFAULT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS IDX_Menu_Order ON menu("order");
    `);
    await queryRunner.query(`
    INSERT INTO menu (id, title, link, "order", parent_id, created_at, updated_at)
    VALUES 
        ('${generateEntityId("", "menu")}', 'Top menu', 'top-menu', 1, NULL, NOW(), NOW()),
        ('${generateEntityId("", "menu")}', 'Main menu', 'main-menu', 2, NULL, NOW(), NOW()),
        ('${generateEntityId("", "menu")}', 'Quick Link', 'quick-link', 3,  NULL, NOW(), NOW()),
        ('${generateEntityId("", "menu")}', 'Information', 'information', 4, NULL, NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "menu"`);
  }
}
