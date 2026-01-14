import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotifications1768401374176 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE if not exists notifications (
            id integer PRIMARY KEY AUTO_INCREMENT,
            appointment_id integer NOT NULL,
            message varchar(255) NOT NULL,
            is_send boolean DEFAULT false,
            type_remaind ENUM ('appointment_reminder', 'payment_reminder', 'general') DEFAULT 'general',
            created_at DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
  }
}
