"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDentistries = seedDentistries;
const faker_1 = require("@faker-js/faker");
const dentistry_entity_1 = require("../../src/dentistry/entities/dentistry.entity");
async function seedDentistries(dataSource) {
    const repo = dataSource.getRepository(dentistry_entity_1.Dentistry);
    const count = Number(process.env.SEED_COUNT_DENTISTRIES) || 20;
    const clinics = [];
    for (let i = 0; i < count; i++) {
        const clinic = repo.create({
            street: faker_1.faker.location.streetAddress(),
            city: faker_1.faker.location.city(),
            region: faker_1.faker.location.state(),
        });
        clinics.push(clinic);
    }
    await repo.save(clinics);
    console.log(`✅ Згенеровано ${count} клінік`);
}
//# sourceMappingURL=1_seed-filling-dental-clinics.js.map