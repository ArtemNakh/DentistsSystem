import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { License } from '../../../src/license/entities/license.entity';
import { Worker } from '../../../src/workers/entities/workers.entity';

export async function seedLicenses(
  dataSource: DataSource,
  minLicenses = 1,
  maxLicenses = 3,
) {
  const randomYears = (min: number, max: number) =>
    faker.number.int({ min, max });
  const licenseRepo = dataSource.getRepository(License);
  const workerRepo = dataSource.getRepository(Worker);
  const workers = await workerRepo.find();
  if (workers.length === 0) {
    throw new Error('❌ Спочатку засідай workers!');
  }
  const licenses: License[] = [];
  for (const worker of workers) {
    // випадкова кількість ліцензій для цього працівника
    const count = faker.number.int({ min: minLicenses, max: maxLicenses });
    for (let i = 0; i < count; i++) {
      const license = licenseRepo.create({
        worker,
        issue_date: faker.date.past({ years: randomYears(1, 10) }), // дата видачі
        issued_by: faker.company.name(), // ким видано
        number_license: faker.string.alphanumeric(10).toUpperCase(), // номер ліцензії
        expiration_date: faker.date.future({ years: randomYears(1, 7) }), // дата закінчення
        created_at: faker.date.past({ years: randomYears(1, 5) }), // дата створення
        updated_at: new Date(),
      });
      licenses.push(license);
    }
    console.log(
      `✅ Для працівника #${worker.id} (${worker.surname} ${worker.name}) згенеровано ${count} ліцензій`,
    );
  }
  await licenseRepo.save(licenses);
  console.log(`🎉 Всього згенеровано ${licenses.length} ліцензій`);
}
