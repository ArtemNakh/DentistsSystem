"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkerShifts1768066136282 = void 0;
class CreateWorkerShifts1768066136282 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS workers_shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_shift_worker FOREIGN KEY (worker_id) 
        REFERENCES workers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS workers_shifts`);
    }
}
exports.CreateWorkerShifts1768066136282 = CreateWorkerShifts1768066136282;
//# sourceMappingURL=1768066136282-create-workerShifts.js.map