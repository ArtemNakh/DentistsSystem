import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOperationListAddActive1773771391554 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {await queryRunner.query(`
    ALTER TABLE operation_list
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {  await queryRunner.query(` 
    ALTER TABLE appointments_list
    DROP COLUMN active;
    `);
    }

}
