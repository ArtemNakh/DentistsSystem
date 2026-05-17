"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOperationListAddActive1773771391554 = void 0;
class UpdateOperationListAddActive1773771391554 {
    async up(queryRunner) {
        await queryRunner.query(`
    ALTER TABLE operation_list
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;`);
    }
    async down(queryRunner) {
        await queryRunner.query(` 
    ALTER TABLE appointments_list
    DROP COLUMN active;
    `);
    }
}
exports.UpdateOperationListAddActive1773771391554 = UpdateOperationListAddActive1773771391554;
//# sourceMappingURL=1773771391554-update-operation-list-add-active.js.map