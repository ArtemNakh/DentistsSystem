"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedLicenses = seedLicenses;
const faker_1 = require("@faker-js/faker");
const license_entity_1 = require("../../../src/license/entities/license.entity");
const workers_entity_1 = require("../../../src/workers/entities/workers.entity");
async function seedLicenses(dataSource, minLicenses = 1, maxLicenses = 3) {
    const randomYears = (min, max) => faker_1.faker.number.int({ min, max });
    const licenseRepo = dataSource.getRepository(license_entity_1.License);
    const workerRepo = dataSource.getRepository(workers_entity_1.Worker);
    const workers = await workerRepo.find();
    if (workers.length === 0) {
        throw new Error('❌ Спочатку засідай workers!');
    }
    const licenses = [];
    for (const worker of workers) {
        const count = faker_1.faker.number.int({ min: minLicenses, max: maxLicenses });
        for (let i = 0; i < count; i++) {
            const license = licenseRepo.create({
                worker,
                issue_date: faker_1.faker.date.past({ years: randomYears(1, 10) }),
                issued_by: faker_1.faker.company.name(),
                number_license: faker_1.faker.string.alphanumeric(10).toUpperCase(),
                expiration_date: faker_1.faker.date.future({ years: randomYears(1, 7) }),
                created_at: faker_1.faker.date.past({ years: randomYears(1, 5) }),
                updated_at: new Date(),
            });
            licenses.push(license);
        }
        console.log(`✅ Для працівника #${worker.id} (${worker.surname} ${worker.name}) згенеровано ${count} ліцензій`);
    }
    await licenseRepo.save(licenses);
    console.log(`🎉 Всього згенеровано ${licenses.length} ліцензій`);
}
//# sourceMappingURL=6_seed-filling-license.js.map