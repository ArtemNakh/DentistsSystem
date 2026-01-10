import { MigrationInterface, QueryRunner } from 'typeorm';

export class Licenses1768060567508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists licenses (
        id integer PRIMARY KEY AUTO_INCREMENT,
        worker_id integer NOT NULL,
        issue_date date NOT NULL,
        issued_by varchar(255) NOT NULL,
        number_license varchar(255) NOT NULL,
        expiration_date date,
        created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS licenses `);
  }
}
