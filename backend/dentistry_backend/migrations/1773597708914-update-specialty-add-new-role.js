"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecialtyAddNewRole1773597708914 = void 0;
class UpdateSpecialtyAddNewRole1773597708914 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE specialties 
      MODIFY COLUMN type ENUM('doctor','admin','reception') NOT NULL;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE specialties 
      MODIFY COLUMN type ENUM('doctor','admin') NOT NULL;
    `);
    }
}
exports.UpdateSpecialtyAddNewRole1773597708914 = UpdateSpecialtyAddNewRole1773597708914;
//# sourceMappingURL=1773597708914-update-specialty-add-new-role.js.map