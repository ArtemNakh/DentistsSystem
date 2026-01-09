import { faker } from '@faker-js/faker';
import { Client } from '../src/clients/entities/client.entity';
import { BloodSign } from '../src/clients/entities/client.interface';

import { DataSource } from 'typeorm';

export async function seedClients(dataSource: DataSource) {
  const repo = dataSource.getRepository(Client);

  const count = Number(process.env.SEED_COUNT_CLIENTS) || 20;
  const clients: Client[] = [];

  for (let i = 0; i < count; i++) {
    const client = repo.create({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      middle_name: faker.person.middleName(),
      birthdate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
      blood_resus: faker.helpers.arrayElement([
        BloodSign.plus,
        BloodSign.minus,
      ]),
      blood_group: faker.helpers.arrayElement([1, 2, 3, 4]),
      phone: faker.phone.number('###-###-####'),
      allergic_diseases: faker.lorem.words(3),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      isVerified: false,
    });
    clients.push(client);
  }

  await repo.save(clients);
  console.log(`✅ Згенеровано ${count} клієнтів`);
}
