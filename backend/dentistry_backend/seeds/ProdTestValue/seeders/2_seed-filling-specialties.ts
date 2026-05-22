import { faker } from '@faker-js/faker';
import { Specialty } from '../../../src/specialty/entities/specialty.entity';
import { SpecialtyType } from '../../../src/specialty/entities/specialty.interface';

import { DataSource } from 'typeorm';

export async function seedSpecialties(
  dataSource: DataSource,
  numbersSpecializations = 30,
) {
  const repo = dataSource.getRepository(Specialty);

  const specialties: Specialty[] = [];

  for (let i = 0; i < numbersSpecializations; i++) {
    const specialty = repo.create({
      name: faker.person.jobTitle(),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(Object.values(SpecialtyType)),
    });
    specialties.push(specialty);
  }

  await repo.save(specialties);
  console.log(`✅ Згенеровано ${numbersSpecializations} спеціальностей`);
}
