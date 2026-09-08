import { faker } from '@faker-js/faker';
import { Dentistry } from '../../src/dentistry/entities/dentistry.entity';

import { DataSource } from 'typeorm';

export async function seedDentistries(dataSource: DataSource) {
  const repo = dataSource.getRepository(Dentistry);

  const count = Number(process.env.SEED_COUNT_DENTISTRIES) || 20;
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
  console.log(`✅ Згенеровано ${count} клінік`);
}
