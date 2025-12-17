'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      ` CREATE TABLE IF NOT EXISTS dental_clinics ( id INT PRIMARY KEY AUTO_INCREMENT, create_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, street VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, region VARCHAR(100) ); `,
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      ` DROP TABLE IF EXISTS dental_clinics; `,
    );
  },
};
