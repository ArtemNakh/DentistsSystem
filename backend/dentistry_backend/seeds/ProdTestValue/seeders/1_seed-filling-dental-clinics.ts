import { faker } from '@faker-js/faker';
import { Dentistry } from '../../../src/dentistry/entities/dentistry.entity';

import { DataSource } from 'typeorm';

export async function seedDentistries(dataSource: DataSource,numbersPoint=20) {
  const repo = dataSource.getRepository(Dentistry);

  
  const clinics: Dentistry[] = [];

  for (let i = 0; i <numbersPoint; i++) {
    const clinic = repo.create({
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      region: faker.location.state(),
    });
    clinics.push(clinic);
  }

  await repo.save(clinics);
  console.log(`✅ Згенеровано ${numbersPoint} клінік`);
}
