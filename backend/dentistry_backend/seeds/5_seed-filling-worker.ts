import { faker } from '@faker-js/faker';
import { Dentistry } from '../src/dentistry/entities/dentistry.entity';
import { Specialty } from '../src/specialty/entities/specialty.entity';
import { Worker } from '../src/workers/entities/workers.entity';

import { DataSource } from 'typeorm';

export async function seedWorkers(dataSource: DataSource) {
  const workerRepo = dataSource.getRepository(Worker);
  const specialtyRepo = dataSource.getRepository(Specialty);
  const dentistryRepo = dataSource.getRepository(Dentistry);

  const specialties = await specialtyRepo.find();
  const dentistries = await dentistryRepo.find();

  if (specialties.length === 0 || dentistries.length === 0) {
    throw new Error('❌ Спочатку засідай specialties та dentistries!');
  }

  const count = Number(process.env.SEED_COUNT_WORKERS) || 20;
  const workers: Worker[] = [];

  for (let i = 0; i < count; i++) {
    const worker = workerRepo.create({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      middle_name: faker.person.middleName(),
      birthday: faker.date.birthdate({ min: 22, max: 65, mode: 'age' }),
      phone: faker.phone.number('###-###-####'),
      specialty: faker.helpers.arrayElement(specialties),
      dentistry: faker.helpers.arrayElement(dentistries),
      login: faker.internet.userName(),
      password: faker.internet.password({ length: 10 }),
    });
    workers.push(worker);
  }

  await workerRepo.save(workers);
  console.log(`✅ Згенеровано ${count} працівників`);
}
