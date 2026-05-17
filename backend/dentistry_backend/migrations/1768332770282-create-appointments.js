"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointments1768332770282 = void 0;
class CreateAppointments1768332770282 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    worker_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    notes VARCHAR(255),
    status ENUM('schedule','completed','wait_paid','cancelled') NOT NULL DEFAULT 'schedule',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointment_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;`);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS appointments');
    }
}
exports.CreateAppointments1768332770282 = CreateAppointments1768332770282;
//# sourceMappingURL=1768332770282-create-appointments.js.map