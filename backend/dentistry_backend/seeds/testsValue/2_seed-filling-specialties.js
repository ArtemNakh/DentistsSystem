"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSpecialties = seedSpecialties;
const faker_1 = require("@faker-js/faker");
const specialty_entity_1 = require("../../src/specialty/entities/specialty.entity");
const specialty_interface_1 = require("../../src/specialty/entities/specialty.interface");
async function seedSpecialties(dataSource) {
    const repo = dataSource.getRepository(specialty_entity_1.Specialty);
    const count = Number(process.env.SEED_COUNT_SPECIALTIES) || 15;
    const specialties = [];
    for (let i = 0; i < count; i++) {
        const specialty = repo.create({
            name: faker_1.faker.person.jobTitle(),
            description: faker_1.faker.lorem.sentence(),
            type: faker_1.faker.helpers.arrayElement([specialty_interface_1.SpecialtyType.DOCTOR, specialty_interface_1.SpecialtyType.ADMIN]),
        });
        specialties.push(specialty);
    }
    await repo.save(specialties);
    console.log(`✅ Згенеровано ${count} спеціальностей`);
}
//# sourceMappingURL=2_seed-filling-specialties.js.map