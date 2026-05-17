"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOperationList = seedOperationList;
const faker_1 = require("@faker-js/faker");
const operation_list_entity_1 = require("../../src/operation-list/entities/operation-list.entity");
async function seedOperationList(dataSource) {
    const repo = dataSource.getRepository(operation_list_entity_1.OperationList);
    const count = Number(process.env.SEED_COUNT_OPERATIONS) || 20;
    const operations = [];
    for (let i = 0; i < count; i++) {
        const operation = repo.create({
            name: faker_1.faker.commerce.productName(),
            description: faker_1.faker.commerce.productDescription(),
            price: parseFloat(faker_1.faker.commerce.price({ min: 50, max: 500 })),
        });
        operations.push(operation);
    }
    await repo.save(operations);
    console.log(`✅ Згенеровано ${count} типів операцій`);
}
//# sourceMappingURL=3_seed-filling-operation-list.js.map