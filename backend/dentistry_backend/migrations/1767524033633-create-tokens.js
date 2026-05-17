"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTokens1767524033633 = void 0;
class CreateTokens1767524033633 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE if not exists tokens (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL,
        token VARCHAR(100) NOT NULL UNIQUE,
        type ENUM('VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET') NOT NULL,
        expires_in TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS tokens`);
    }
}
exports.CreateTokens1767524033633 = CreateTokens1767524033633;
//# sourceMappingURL=1767524033633-create-tokens.js.map