import { faker } from "@faker-js/faker";
import { OperationList } from "../../src/operation-list/entities/operation-list.entity";

import { DataSource } from "typeorm";

export async function seedOperationList(dataSource: DataSource) {
  const repo = dataSource.getRepository(OperationList);

  const count = Number(process.env.SEED_COUNT_OPERATIONS) || 20;
  const operations: OperationList[] = [];

  for (let i = 0; i < count; i++) {
    const operation = repo.create({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
    });
    operations.push(operation);
  }

  await repo.save(operations);
  console.log(`✅ Згенеровано ${count} типів операцій`);
}
