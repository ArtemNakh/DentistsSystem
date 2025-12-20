import AppDataSource from "../src/database/data-source";
import { Specialty } from "../src/specialty/entities/specialty.entity";
import { faker } from "@faker-js/faker";

async function runSeed() {
  try {
    // 1. Ініціалізація DataSource
    await AppDataSource.initialize();

    const repo = AppDataSource.getRepository(Specialty);

    // 2. Кількість записів (можна задати через ENV або змінну)
    const count = Number(process.env.SEED_COUNT) || 15;

    const specialties: Specialty[] = [];

    for (let i = 0; i < count; i++) {
      const specialty = repo.create({
        name: faker.person.jobTitle(), // випадкова назва спеціальності
        description: faker.lorem.sentence(), // випадковий опис
      });
      specialties.push(specialty);
    }

    await repo.save(specialties);
    console.log(`✅ Згенеровано ${count} випадкових спеціальностей`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Помилка при сидінгу:", error);
  }
}

runSeed();
