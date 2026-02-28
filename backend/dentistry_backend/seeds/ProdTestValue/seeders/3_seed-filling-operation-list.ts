import { faker } from '@faker-js/faker';
import { Dentistry } from '../../../src/dentistry/entities/dentistry.entity';
import { OperationList } from '../../../src/operation-list/entities/operation-list.entity';

import { DataSource } from 'typeorm';
export async function seedOperationList(
  dataSource: DataSource,
  minPerClinic = 10,
  maxPerClinic = 20,
  minCost = 50,
  maxCost = 500,
) {
  const operationRepo = dataSource.getRepository(OperationList);
  const dentistryRepo = dataSource.getRepository(Dentistry);

  const clinics = await dentistryRepo.find();
  const operations: OperationList[] = [];
  for (const clinic of clinics) {
    // Випадкова кількість операцій для цієї клініки
    const count = faker.number.int({ min: minPerClinic, max: maxPerClinic });
    for (let i = 0; i < count; i++) {
      const operation = operationRepo.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: minCost, max: maxCost })),
        dental_clinic: clinic, // зв’язок з клінікою
      });
      operations.push(operation);
    }
    console.log(
      `✅ Для клініки #${clinic.id} (${clinic.city}, ${clinic.street}) згенеровано ${count} операцій`,
    );
  }
  await operationRepo.save(operations);
  console.log(`🎉 Всього згенеровано ${operations.length} операцій`);
}
