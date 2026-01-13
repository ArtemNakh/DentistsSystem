import { faker } from "@faker-js/faker";
import { Specialty } from "../../src/specialty/entities/specialty.entity";

import { DataSource } from "typeorm";
import { SpecialtyType } from "../../src/specialty/entities/specialty.interface";

export async function seedSpecialties(dataSource: DataSource) {
  const repo = dataSource.getRepository(Specialty);

  const count = Number(process.env.SEED_COUNT_SPECIALTIES) || 15;
  const specialties: Specialty[] = [];

  for (let i = 0; i < count; i++) {
    const specialty = repo.create({
      name: faker.person.jobTitle(),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement([SpecialtyType.DOCTOR, SpecialtyType.ADMIN]),
    });
    specialties.push(specialty);
  }

  await repo.save(specialties);
  console.log(`✅ Згенеровано ${count} спеціальностей`);
}
