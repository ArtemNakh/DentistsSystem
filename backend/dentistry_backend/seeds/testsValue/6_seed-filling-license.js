"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedLicenses = seedLicenses;
const faker_1 = require("@faker-js/faker");
const license_entity_1 = require("../../src/license/entities/license.entity");
const workers_entity_1 = require("../../src/workers/entities/workers.entity");
async function seedLicenses(dataSource) {
    const licenseRepo = dataSource.getRepository(license_entity_1.License);
    const workerRepo = dataSource.getRepository(workers_entity_1.Worker);
    const workers = await workerRepo.find();
    if (workers.length === 0) {
        throw new Error('❌ Спочатку засідай workers!');
    }
    const count = Number(process.env.SEED_COUNT_LICENSES) || 30;
    const licenses = [];
    for (let i = 0; i < count; i++) {
        const license = licenseRepo.create({
            worker: faker_1.faker.helpers.arrayElement(workers),
            issue_date: faker_1.faker.date.past({ years: 5 }),
            issued_by: faker_1.faker.company.name(),
            number_license: faker_1.faker.string.alphanumeric(10).toUpperCase(),
            expiration_date: faker_1.faker.date.future({ years: 5 }),
            created_at: faker_1.faker.date.past({ years: 2 }),
            updated_at: new Date(),
        });
        licenses.push(license);
    }
    await licenseRepo.save(licenses);
    console.log(`✅ Згенеровано ${count} ліцензій`);
}
//# sourceMappingURL=6_seed-filling-license.js.map