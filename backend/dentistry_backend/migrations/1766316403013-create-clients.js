"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClients1766316403013 = void 0;
class CreateClients1766316403013 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    birthdate DATE NOT NULL,
    blood_group INT NOT NULL,
    blood_resus ENUM('plus','minus') NOT NULL,
    phone VARCHAR(30) NOT NULL,
    allergic_diseases VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    isverified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS clients`);
    }
}
exports.CreateClients1766316403013 = CreateClients1766316403013;
//# sourceMappingURL=1766316403013-create-clients.js.map