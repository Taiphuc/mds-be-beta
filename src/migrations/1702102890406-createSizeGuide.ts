import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSizeGuide1702102890406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE size_guide (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                top_text TEXT NOT NULL,
                content TEXT NOT NULL,
                status BOOLEAN DEFAULT FALSE,
                bottom_text TEXT NOT NULL
            );
        `);

    await queryRunner.query(`
            ALTER TABLE product ADD COLUMN size_guide_id INTEGER DEFAULT NULL;
        `);

    await queryRunner.query(`
        ALTER TABLE product
        ADD CONSTRAINT fk_size_guide_product
        FOREIGN KEY (size_guide_id)
        REFERENCES size_guide(id);
    `);

    await queryRunner.query(`
    ALTER TABLE product_collection ADD COLUMN size_guide_id INTEGER DEFAULT NULL;
    `);

    await queryRunner.query(`
    ALTER TABLE product_collection
    ADD CONSTRAINT fk_size_guide_collection
    FOREIGN KEY (size_guide_id)
    REFERENCES size_guide(id);
    `);

    await queryRunner.query(`
    ALTER TABLE product_tag ADD COLUMN size_guide_id INTEGER DEFAULT NULL;
    `);

    await queryRunner.query(`
    ALTER TABLE product_tag
    ADD CONSTRAINT fk_size_guide_tag
    FOREIGN KEY (size_guide_id)
    REFERENCES size_guide(id);
    `);

    await queryRunner.query(`
    ALTER TABLE product_variant ADD COLUMN size_guide_id INTEGER DEFAULT NULL;
    `);

    await queryRunner.query(`
    ALTER TABLE product_variant
    ADD CONSTRAINT fk_size_guide_variant
    FOREIGN KEY (size_guide_id)
    REFERENCES size_guide(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    await queryRunner.query(`
        ALTER TABLE product DROP CONSTRAINT fk_size_guide_product;
    `);

    await queryRunner.query(`
    ALTER TABLE product DROP COLUMN size_guide_id;
    `);

    // Drop the foreign key constraint
    await queryRunner.query(`
        ALTER TABLE product_collection DROP CONSTRAINT fk_size_guide_collection;
    `);

    await queryRunner.query(`
    ALTER TABLE product_collection DROP COLUMN size_guide_id;
    `);

    // Drop the foreign key constraint
    await queryRunner.query(`
        ALTER TABLE product_tag DROP CONSTRAINT fk_size_guide_tag;
    `);
    await queryRunner.query(`
    ALTER TABLE product_tag DROP COLUMN size_guide_id;
    `);

    // Drop the foreign key constraint
    await queryRunner.query(`
        ALTER TABLE product_variant DROP CONSTRAINT fk_size_guide_variant;
    `);

    await queryRunner.query(`
    ALTER TABLE product_variant DROP COLUMN size_guide_id;
    `);

    await queryRunner.query(`
            DROP TABLE size_guide;
        `);
  }
}
