'use strict';
const { faker } = require('@faker-js/faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const count = 20; // ← тут задаєш кількість записів
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        region: faker.location.state(),
        create_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('dental_clinics', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dental_clinics', null, {});
  },
};
