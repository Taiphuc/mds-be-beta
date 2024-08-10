import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateLogVisitor1705332727325 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "log-visitor" (
                id serial NOT NULL PRIMARY KEY,
                ip character varying NOT NULL,
                context character varying NOT NULL,
                products JSONB DEFAULT NULL,
                metadata JSONB DEFAULT NULL,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
                     );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "log-visitor"`);
    }

}
