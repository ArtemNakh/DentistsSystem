"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayments1768406249819 = void 0;
class CreatePayments1768406249819 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT UNIQUE NOT NULL,
    amount DOUBLE NOT NULL,
    status_paid ENUM('paid','not_paid') DEFAULT 'not_paid',
    method_pay ENUM('card','cash','transfer') NOT NULL,
    payment_date DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS  payments`);
    }
}
exports.CreatePayments1768406249819 = CreatePayments1768406249819;
//# sourceMappingURL=1768406249819-create-payments.js.map