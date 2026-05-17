"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkerAddFlagActive1773765469450 = void 0;
class UpdateWorkerAddFlagActive1773765469450 {
    async up(queryRunner) {
        await queryRunner.query(`
    ALTER TABLE workers
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;`);
    }
    async down(queryRunner) {
        await queryRunner.query(` 
    ALTER TABLE workers
    DROP COLUMN active;
    `);
    }
}
exports.UpdateWorkerAddFlagActive1773765469450 = UpdateWorkerAddFlagActive1773765469450;
//# sourceMappingURL=1773765469450-update-worker-add-flag-active.js.map