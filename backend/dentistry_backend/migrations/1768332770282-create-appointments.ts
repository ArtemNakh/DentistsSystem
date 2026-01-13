import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointments1768332770282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists appointments (
            id integer PRIMARY KEY AUTO_INCREMENT,
            client_id integer NOT NULL,
            worker_id integer NOT NULL,
            appointment_date datetime NOT NULL,
            notes varchar(255),
            status ENUM ('schedule', 'completed', 'wait_paid', 'cancelled') NOT NULL DEFAULT 'schedule',
            created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS appointments');
  }
}
