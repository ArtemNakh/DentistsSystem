"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDentistries = seedDentistries;
const faker_1 = require("@faker-js/faker");
const dentistry_entity_1 = require("../../../src/dentistry/entities/dentistry.entity");
async function seedDentistries(dataSource, numbersPoint = 20) {
    const repo = dataSource.getRepository(dentistry_entity_1.Dentistry);
    const clinics = [];
    for (let i = 0; i < numbersPoint; i++) {
        const clinic = repo.create({
            street: faker_1.faker.location.streetAddress(),
            city: faker_1.faker.location.city(),
            region: faker_1.faker.location.state(),
        });
        clinics.push(clinic);
    }
    await repo.save(clinics);
    console.log(`✅ Згенеровано ${numbersPoint} клінік`);
}
//# sourceMappingURL=1_seed-filling-dental-clinics.js.map