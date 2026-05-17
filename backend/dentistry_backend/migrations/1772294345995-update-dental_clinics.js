"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDentalClinics1772294345995 = void 0;
class UpdateDentalClinics1772294345995 {
    async up(queryRunner) {
        await queryRunner.query(` ALTER TABLE operation_list ADD COLUMN dental_clinic_id INT , ADD CONSTRAINT fk_operationlist_dentalclinic FOREIGN KEY (dental_clinic_id) REFERENCES dental_clinics(id) ON DELETE CASCADE ON UPDATE CASCADE; `);
    }
    async down(queryRunner) {
        await queryRunner.query(` ALTER TABLE operation_list DROP FOREIGN KEY fk_operationlist_dentalclinic, DROP COLUMN dental_clinic_id; `);
    }
}
exports.UpdateDentalClinics1772294345995 = UpdateDentalClinics1772294345995;
//# sourceMappingURL=1772294345995-update-dental_clinics.js.map