import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNotifications1778864882540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE notifications 
      MODIFY COLUMN type_remaind 
      ENUM('appointment_reminder','payment_reminder','general','planned_appointment') 
      DEFAULT 'general';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.query(`
      ALTER TABLE notifications 
      MODIFY COLUMN type_remaind 
      ENUM('appointment_reminder','payment_reminder','general') 
      DEFAULT 'general';
    `);}
}
