import { faker } from '@faker-js/faker';
import { Dentistry } from '../../../src/dentistry/entities/dentistry.entity';
import { Specialty } from '../../../src/specialty/entities/specialty.entity';
import { Worker } from '../../../src/workers/entities/workers.entity';

import { DataSource } from 'typeorm';

export async function seedWorkers(
  dataSource: DataSource,
  minWorkers = 5,
  maxWorkers = 15,
) {
  const workerRepo = dataSource.getRepository(Worker);
  const specialtyRepo = dataSource.getRepository(Specialty);
  const dentistryRepo = dataSource.getRepository(Dentistry);
  const specialties = await specialtyRepo.find();
  const dentistries = await dentistryRepo.find();
  if (specialties.length === 0 || dentistries.length === 0) {
    throw new Error('❌ Спочатку засідай specialties та dentistries!');
  }
  const workers: Worker[] = [];
  for (const clinic of dentistries) {
    // випадкова кількість працівників для клініки
    const countWorkers = faker.number.int({ min: minWorkers, max: maxWorkers });
    for (let i = 0; i < countWorkers; i++) {
      // вибираємо спеціальність випадково
      const specialty = faker.helpers.arrayElement(specialties);
      const worker = workerRepo.create({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        middle_name: faker.person.middleName(),
        birthday: faker.date.birthdate({ min: 22, max: 65, mode: 'age' }),
        phone: faker.phone.number('###-###-####'),
        specialty,
        dentistry: clinic,
        login: faker.internet.userName(),
        password: faker.internet.password({ length: 10 }),
      });
      workers.push(worker);
    }
    console.log(
      `✅ Для клініки #${clinic.id} (${clinic.city}, ${clinic.street}) згенеровано ${countWorkers} працівників`,
    );
  }
  await workerRepo.save(workers);
  console.log(`🎉 Всього згенеровано ${workers.length} працівників`);
}
