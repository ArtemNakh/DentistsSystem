"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotifications1768401374176 = void 0;
class CreateNotifications1768401374176 {
    async up(queryRunner) {
        await queryRunner.query(`
          -- Повідомлення
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_send BOOLEAN DEFAULT FALSE,
    type_remaind ENUM('appointment_reminder','payment_reminder','general') DEFAULT 'general',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_appointment FOREIGN KEY (appointment_id) 
        REFERENCES appointments(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
            `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    }
}
exports.CreateNotifications1768401374176 = CreateNotifications1768401374176;
//# sourceMappingURL=1768401374176-create-notifications.js.map