import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokens1767524033633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists tokens (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL,
        token VARCHAR(100) NOT NULL UNIQUE,
        type ENUM('VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET') NOT NULL,
        expires_in TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tokens`);
  }
}
