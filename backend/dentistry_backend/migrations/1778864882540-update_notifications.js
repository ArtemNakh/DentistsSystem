"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotifications1778864882540 = void 0;
class UpdateNotifications1778864882540 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE notifications 
      MODIFY COLUMN type_remaind 
      ENUM('appointment_reminder','payment_reminder','general','planned_appointment') 
      DEFAULT 'general';
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE notifications 
      MODIFY COLUMN type_remaind 
      ENUM('appointment_reminder','payment_reminder','general') 
      DEFAULT 'general';
    `);
    }
}
exports.UpdateNotifications1778864882540 = UpdateNotifications1778864882540;
//# sourceMappingURL=1778864882540-update_notifications.js.map