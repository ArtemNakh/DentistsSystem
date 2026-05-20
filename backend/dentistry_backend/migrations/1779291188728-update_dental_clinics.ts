import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDentalClinics1779291188728 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE dental_clinics
      ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE dental_clinics
      DROP COLUMN is_active;
    `);
  }
}
