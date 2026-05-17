"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Licenses1768060567508 = void 0;
class Licenses1768060567508 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS licenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    issue_date DATE NOT NULL,
    issued_by VARCHAR(255) NOT NULL,
    number_license VARCHAR(255) NOT NULL,
    expiration_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_license_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS licenses `);
    }
}
exports.Licenses1768060567508 = Licenses1768060567508;
//# sourceMappingURL=1768060567508-licenses.js.map