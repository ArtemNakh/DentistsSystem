"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOperationList1766313590880 = void 0;
class CreateOperationList1766313590880 {
    async up(queryRunner) {
        await queryRunner.query(` CREATE TABLE IF NOT EXISTS operation_list (
        id integer PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        name varchar(150) NOT NULL,
        description varchar(255),
        price double NOT NULL
        );`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS operation_list;`);
    }
}
exports.CreateOperationList1766313590880 = CreateOperationList1766313590880;
//# sourceMappingURL=1766313590880-create-operation-list.js.map