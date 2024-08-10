import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateCustomProductAndCustomerCustomProduct1708357861164 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "custom_product_base" (
            id serial NOT NULL PRIMARY KEY,
            product_id character varying DEFAULT NULL,
            thumbnail character varying DEFAULT NULL,
            layers jsonb DEFAULT '{}',
            template jsonb DEFAULT '{}',
            external_id character DEFAULT NULL,
            template_data jsonb DEFAULT '{}',
            print_file_data jsonb DEFAULT '{}',
            metadata jsonb DEFAULT '{}',
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            updated_at TIMESTAMP NOT NULL DEFAULT now()
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "custom_product" (
            id serial NOT NULL PRIMARY KEY,
            product_id character varying NOT NULL,
            customer_id character varying NOT NULL,
            product_base_id character varying NOT NULL,
            image character varying NOT NULL,
            metadata jsonb DEFAULT '{}',
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            updated_at TIMESTAMP NOT NULL DEFAULT now()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "custom_product_base"`);
        await queryRunner.query(`DROP TABLE "custom_product"`);
    }

}
