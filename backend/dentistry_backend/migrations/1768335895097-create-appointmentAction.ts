import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointmentAction1768335895097 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists appointments_actions (
            id integer PRIMARY KEY AUTO_INCREMENT,
            appointment_id integer NOT NULL,
            operation_id integer NOT NULL,
            created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS appointment_actions`);
  }
}
