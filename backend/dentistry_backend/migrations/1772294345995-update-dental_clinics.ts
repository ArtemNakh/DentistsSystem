import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDentalClinics1772294345995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` ALTER TABLE operation_list ADD COLUMN dental_clinic_id INT , ADD CONSTRAINT fk_operationlist_dentalclinic FOREIGN KEY (dental_clinic_id) REFERENCES dental_clinics(id) ON DELETE CASCADE ON UPDATE CASCADE; `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` ALTER TABLE operation_list DROP FOREIGN KEY fk_operationlist_dentalclinic, DROP COLUMN dental_clinic_id; `,
    );
  }
}
