"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOperationList = seedOperationList;
const faker_1 = require("@faker-js/faker");
const dentistry_entity_1 = require("../../../src/dentistry/entities/dentistry.entity");
const operation_list_entity_1 = require("../../../src/operation-list/entities/operation-list.entity");
async function seedOperationList(dataSource, minPerClinic = 10, maxPerClinic = 20, minCost = 50, maxCost = 500) {
    const operationRepo = dataSource.getRepository(operation_list_entity_1.OperationList);
    const dentistryRepo = dataSource.getRepository(dentistry_entity_1.Dentistry);
    const clinics = await dentistryRepo.find();
    const operations = [];
    for (const clinic of clinics) {
        const count = faker_1.faker.number.int({ min: minPerClinic, max: maxPerClinic });
        for (let i = 0; i < count; i++) {
            const operation = operationRepo.create({
                name: faker_1.faker.commerce.productName(),
                description: faker_1.faker.commerce.productDescription(),
                price: parseFloat(faker_1.faker.commerce.price({ min: minCost, max: maxCost })),
                dental_clinic: clinic,
            });
            operations.push(operation);
        }
        console.log(`✅ Для клініки #${clinic.id} (${clinic.city}, ${clinic.street}) згенеровано ${count} операцій`);
    }
    await operationRepo.save(operations);
    console.log(`🎉 Всього згенеровано ${operations.length} операцій`);
}
//# sourceMappingURL=3_seed-filling-operation-list.js.map