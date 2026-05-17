"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSpecialty1766268547720 = void 0;
class CreateSpecialty1766268547720 {
    async up(queryRunner) {
        await queryRunner.query(`
     CREATE TABLE IF NOT EXISTS specialties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    type ENUM('doctor','admin') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
 `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS specialties`);
    }
}
exports.CreateSpecialty1766268547720 = CreateSpecialty1766268547720;
//# sourceMappingURL=1766268547720-create-specialty.js.map