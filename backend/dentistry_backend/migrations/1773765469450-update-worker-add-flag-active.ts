import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWorkerAddFlagActive1773765469450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE workers
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(` 
    ALTER TABLE workers
    DROP COLUMN active;
    `);
  }
}
