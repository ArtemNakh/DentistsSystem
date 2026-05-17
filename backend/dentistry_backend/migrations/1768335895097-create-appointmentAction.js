"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentAction1768335895097 = void 0;
class CreateAppointmentAction1768335895097 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS appointments_actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    operation_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_action_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_action_operation FOREIGN KEY (operation_id) REFERENCES operation_list(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
            `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS appointment_actions`);
    }
}
exports.CreateAppointmentAction1768335895097 = CreateAppointmentAction1768335895097;
//# sourceMappingURL=1768335895097-create-appointmentAction.js.map