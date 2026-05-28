import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1779981165323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // appointments
    await queryRunner.query(
      `CREATE INDEX idx_worker_date ON appointments (worker_id, appointment_date)`,
    );

    // workers
    await queryRunner.query(
      `CREATE INDEX idx_dentistry_id ON workers (dentistry_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_specialty_id ON workers (specialty_id)`,
    );

    // workers_shifts
    await queryRunner.query(
      `CREATE INDEX idx_worker_shift_date ON workers_shifts (worker_id, shift_date)`,
    );

    // operation_list
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_clinic_operation_name ON operation_list (dental_clinic_id, name)`,
    );

    // dental_clinics
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_clinic_address ON dental_clinics (street, city, region)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_worker_date ON appointments`);

    await queryRunner.query(`DROP INDEX idx_dentistry_id ON workers`);
    await queryRunner.query(`DROP INDEX idx_specialty_id ON workers`);

    await queryRunner.query(
      `DROP INDEX idx_worker_shift_date ON workers_shifts`,
    );

    await queryRunner.query(
      `DROP INDEX idx_clinic_operation_name ON operation_list`,
    );

    await queryRunner.query(`DROP INDEX idx_clinic_address ON dental_clinics`);
  }
}
