import { OperationList } from "../src/operation-list/entities/operation-list.entity";
import AppDataSource from "../src/database/data-source";
import { faker } from "@faker-js/faker";

async function runSeed() {
  try {
    // 1. Ініціалізація DataSource
    await AppDataSource.initialize();

    const repo = AppDataSource.getRepository(OperationList);

    // 2. Кількість записів (можна задати через ENV або змінну)
    const count = Number(process.env.SEED_COUNT) || 20;

    const operations: OperationList[] = [];

    for (let i = 0; i < count; i++) {
      const operation = repo.create({
        name: faker.commerce.productName(),          // випадкова назва
        description: faker.commerce.productDescription(), // випадковий опис
        price: parseFloat(faker.commerce.price({ min: 50, max: 500 })), // випадкова ціна
      });
      operations.push(operation);
    }

    await repo.save(operations);
    console.log(`✅ Згенеровано ${count} випадкових операцій`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Помилка при сидінгу:", error);
  }
}

runSeed();
