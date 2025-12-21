import { Client } from "../src/clients/entities/client.entity";
import AppDataSource from "../src/database/data-source";

import { faker } from "@faker-js/faker";
import { BloodSign } from "../src/clients/entities/client.interface";

async function runSeed() {
  try {
    // 1. Ініціалізація DataSource
    await AppDataSource.initialize();

    const repo = AppDataSource.getRepository(Client);

    // 2. Кількість записів (можна задати через ENV або змінну)
    const count = Number(process.env.SEED_COUNT) || 20;

    const clients: Client[] = [];

    for (let i = 0; i < count; i++) {
      const client = repo.create({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        middle_name: faker.person.middleName(),
        birthdate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        blood_resus: faker.helpers.arrayElement([BloodSign.plus, BloodSign.minus]),
        phone: faker.phone.number('###-###-####'),
        allergic_diseases: faker.lorem.words(3), // випадкові "алергії"
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
      });
      clients.push(client);
    }

    await repo.save(clients);
    console.log(`✅ Згенеровано ${count} випадкових клієнтів`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Помилка при сидінгу:", error);
  }
}

runSeed();
