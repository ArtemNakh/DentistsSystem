import AppDataSource from '../../src/database/data-source';
import { seedDentistries } from './seeders/1_seed-filling-dental-clinics';
import { seedSpecialties } from './seeders/2_seed-filling-specialties';
import { seedOperationList } from './seeders/3_seed-filling-operation-list';
import { seedClients } from './seeders/4_seed-filling-clients';
import { seedWorkers } from './seeders/5_seed-filling-worker';
import { seedLicenses } from './seeders/6_seed-filling-license';
import { seedWorkerShifts } from './seeders/7_seed-filling-workers-shifts';

async function runAllSeeds() {
  try {
    //запуск
    //    npx ts-node ./src/seeds/index.ts

    await AppDataSource.initialize();

    await seedDentistries(AppDataSource);
    await seedSpecialties(AppDataSource, 50);
    await seedOperationList(AppDataSource, 50, 100, 10, 1000);
    await seedClients(AppDataSource, 1000);
    await seedWorkers(AppDataSource, 5, 100);
    await seedLicenses(AppDataSource, 2, 14);
    await seedWorkerShifts(AppDataSource, 20, 100);

    console.log('✅ Усі сидери відпрацювали успішно');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Помилка при запуску сидів:', error);
    await AppDataSource.destroy();
  }
}

runAllSeeds();
