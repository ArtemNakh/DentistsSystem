"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDentalClinics1766160645839 = void 0;
class CreateDentalClinics1766160645839 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS dental_clinics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )ENGINE=InnoDB;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS dental_clinics;`);
    }
}
exports.CreateDentalClinics1766160645839 = CreateDentalClinics1766160645839;
//# sourceMappingURL=1766160645839-create-dental_clinics.js.map