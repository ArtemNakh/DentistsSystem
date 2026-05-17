"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkers1767985298102 = void 0;
class CreateWorkers1767985298102 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS workers`);
    }
}
exports.CreateWorkers1767985298102 = CreateWorkers1767985298102;
//# sourceMappingURL=1767985298102-create-workers.js.map