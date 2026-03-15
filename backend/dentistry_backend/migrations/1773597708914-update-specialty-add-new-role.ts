import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSpecialtyAddNewRole1773597708914 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE specialties 
      MODIFY COLUMN type ENUM('doctor','admin','reception') NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE specialties 
      MODIFY COLUMN type ENUM('doctor','admin') NOT NULL;
    `);
  }
}
