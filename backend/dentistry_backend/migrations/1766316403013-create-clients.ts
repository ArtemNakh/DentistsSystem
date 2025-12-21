import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClients1766316403013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS clients (
        id integer PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        name varchar(100) NOT NULL,
        surname varchar(100) NOT NULL,
        middle_name varchar(100) NOT NULL,
        birthdate date NOT NULL,
        blood_group integer NOT NULL,
        blood_resus ENUM ('plus', 'minus') NOT NULL,
        phone varchar(30) NOT NULL,
        allergic_diseases varchar(255) NOT NULL,
        email varchar(100) NOT NULL,
        password varchar(100) NOT NULL
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS clients`);
  }
}
