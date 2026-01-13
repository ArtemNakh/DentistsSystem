import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { License } from '../../src/license/entities/license.entity';
import { Worker } from '../../src/workers/entities/workers.entity';

export async function seedLicenses(dataSource: DataSource) {
  const licenseRepo = dataSource.getRepository(License);
  const workerRepo = dataSource.getRepository(Worker);

  const workers = await workerRepo.find();

  if (workers.length === 0) {
    throw new Error('❌ Спочатку засідай workers!');
  }

  const count = Number(process.env.SEED_COUNT_LICENSES) || 30;
  const licenses: License[] = [];

  for (let i = 0; i < count; i++) {
    const license = licenseRepo.create({
      worker: faker.helpers.arrayElement(workers), // випадковий працівник
      issue_date: faker.date.past({ years: 5 }), // дата видачі
      issued_by: faker.company.name(), // ким видано
      number_license: faker.string.alphanumeric(10).toUpperCase(), // номер ліцензії
      expiration_date: faker.date.future({ years: 5 }), // дата закінчення
      created_at: faker.date.past({ years: 2 }), // випадкова дата створення
      updated_at: new Date(),
    });
    licenses.push(license);
  }

  await licenseRepo.save(licenses);
  console.log(`✅ Згенеровано ${count} ліцензій`);
}
