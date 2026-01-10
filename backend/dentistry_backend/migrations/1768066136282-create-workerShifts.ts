import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkerShifts1768066136282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists workers_shifts (
        id integer PRIMARY KEY AUTO_INCREMENT,
        worker_id integer NOT NULL,
        shift_date Date NOT NULL,
        start_time Time NOT NULL,
        end_time Time NOT NULL,
        created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS workers_shifts`);
  }
}
