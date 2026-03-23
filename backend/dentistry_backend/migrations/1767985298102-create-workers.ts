import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkers1767985298102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS workers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    birthday DATE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    specialty_id INT NOT NULL,
    dentistry_id INT NOT NULL,
    login VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_worker_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_worker_clinic FOREIGN KEY (dentistry_id) REFERENCES dental_clinics(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS workers`);
  }
}
