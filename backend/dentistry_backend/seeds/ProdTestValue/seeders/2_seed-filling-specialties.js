"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSpecialties = seedSpecialties;
const faker_1 = require("@faker-js/faker");
const specialty_entity_1 = require("../../../src/specialty/entities/specialty.entity");
const specialty_interface_1 = require("../../../src/specialty/entities/specialty.interface");
async function seedSpecialties(dataSource, numbersSpecializations = 30) {
    const repo = dataSource.getRepository(specialty_entity_1.Specialty);
    const specialties = [];
    for (let i = 0; i < numbersSpecializations; i++) {
        const specialty = repo.create({
            name: faker_1.faker.person.jobTitle(),
            description: faker_1.faker.lorem.sentence(),
            type: faker_1.faker.helpers.arrayElement(Object.values(specialty_interface_1.SpecialtyType)),
        });
        specialties.push(specialty);
    }
    await repo.save(specialties);
    console.log(`✅ Згенеровано ${numbersSpecializations} спеціальностей`);
}
//# sourceMappingURL=2_seed-filling-specialties.js.map