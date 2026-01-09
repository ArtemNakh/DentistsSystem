import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkers1767985298102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists workers (
            id integer PRIMARY KEY AUTO_INCREMENT,
            created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            name varchar(100) NOT NULL,
            surname varchar(100) NOT NULL,
            middle_name varchar(100) NOT NULL,
            birthday date NOT NULL,
            phone varchar(30) NOT NULL,
            specialty_id integer NOT NULL,
            dentistry_id integer NOT NULL,
            login varchar(100) NOT NULL,
            password varchar(100) NOT NULL
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS workers`);
  }
}
