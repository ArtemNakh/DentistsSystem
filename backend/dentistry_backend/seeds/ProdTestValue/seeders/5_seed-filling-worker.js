"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedWorkers = seedWorkers;
const faker_1 = require("@faker-js/faker");
const dentistry_entity_1 = require("../../../src/dentistry/entities/dentistry.entity");
const specialty_entity_1 = require("../../../src/specialty/entities/specialty.entity");
const workers_entity_1 = require("../../../src/workers/entities/workers.entity");
async function seedWorkers(dataSource, minWorkers = 5, maxWorkers = 15) {
    const workerRepo = dataSource.getRepository(workers_entity_1.Worker);
    const specialtyRepo = dataSource.getRepository(specialty_entity_1.Specialty);
    const dentistryRepo = dataSource.getRepository(dentistry_entity_1.Dentistry);
    const specialties = await specialtyRepo.find();
    const dentistries = await dentistryRepo.find();
    if (specialties.length === 0 || dentistries.length === 0) {
        throw new Error('❌ Спочатку засідай specialties та dentistries!');
    }
    const workers = [];
    for (const clinic of dentistries) {
        const countWorkers = faker_1.faker.number.int({ min: minWorkers, max: maxWorkers });
        for (let i = 0; i < countWorkers; i++) {
            const specialty = faker_1.faker.helpers.arrayElement(specialties);
            const worker = workerRepo.create({
                name: faker_1.faker.person.firstName(),
                surname: faker_1.faker.person.lastName(),
                middle_name: faker_1.faker.person.middleName(),
                birthday: faker_1.faker.date.birthdate({ min: 22, max: 65, mode: 'age' }),
                phone: faker_1.faker.phone.number('###-###-####'),
                specialty,
                dentistry: clinic,
                login: faker_1.faker.internet.userName(),
                password: faker_1.faker.internet.password({ length: 10 }),
            });
            workers.push(worker);
        }
        console.log(`✅ Для клініки #${clinic.id} (${clinic.city}, ${clinic.street}) згенеровано ${countWorkers} працівників`);
    }
    await workerRepo.save(workers);
    console.log(`🎉 Всього згенеровано ${workers.length} працівників`);
}
//# sourceMappingURL=5_seed-filling-worker.js.map