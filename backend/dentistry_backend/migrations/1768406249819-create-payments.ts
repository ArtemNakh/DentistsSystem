import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayments1768406249819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists payments (
            id integer PRIMARY KEY AUTO_INCREMENT,
            appointment_id integer UNIQUE NOT NULL,
            amount double NOT NULL,
            status_paid ENUM ('paid', 'pending', 'not_paid') DEFAULT 'not_paid',
            method_pay ENUM ('card', 'cash', 'transfer') NOT NULL,
            payment_date datetime NOT NULL,
              created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS  payments`);
  }
}
