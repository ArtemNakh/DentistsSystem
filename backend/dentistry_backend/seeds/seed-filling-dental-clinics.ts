import AppDataSource from "../src/database/data-source";
import { Dentistry } from "../src/dentistry/entities/dentistry.entity";
import { faker } from "@faker-js/faker";

async function runSeed() {
  try {
    // 1. Ініціалізація DataSource
    await AppDataSource.initialize();

    const repo = AppDataSource.getRepository(Dentistry);

    // 2. Кількість записів (можна задати через ENV або змінну)
    const count = Number(process.env.SEED_COUNT) || 20;

    const clinics: Dentistry[] = [];

    for (let i = 0; i < count; i++) {
      const clinic = repo.create({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        region: faker.location.state(),
      });
      clinics.push(clinic);
    }

    await repo.save(clinics);
    console.log(`✅ Згенеровано ${count} випадкових клінік`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Помилка при сидінгу:", error);
  }
}

runSeed();
