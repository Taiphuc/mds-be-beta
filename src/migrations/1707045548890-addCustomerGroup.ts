import { generateEntityId } from "@medusajs/medusa";
import { CUSTOMER_GROUP } from "../utils/const/customerGroup";
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCustomerGroup1707045548890 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO customer_group ("id", "name", "metadata")
        VALUES 
            ( '${generateEntityId("", "crgp")}', '${CUSTOMER_GROUP.subscribeNewProduct}', '{}');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM customer_group WHERE name IN ('${CUSTOMER_GROUP.subscribeNewProduct}');
    `);
    }
}
