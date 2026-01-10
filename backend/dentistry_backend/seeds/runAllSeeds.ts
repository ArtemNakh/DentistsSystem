import AppDataSource from '../src/database/data-source';

import { seedDentistries } from './1_seed-filling-dental-clinics';
import { seedSpecialties } from './2_seed-filling-specialties';
import { seedClients } from './4_seed-filling-clients';
import { seedWorkers } from './5_seed-filling-worker';
import { seedOperationList } from './3_seed-filling-operation-list';
import { seedLicenses } from './6_seed-filling-license';
import { seedWorkerShifts } from './7_seed-filling-workers-shifts';

async function runAllSeeds() {
  try {
    //запуск
    //    npx ts-node ./src/seeds/index.ts

    await AppDataSource.initialize();

    await seedDentistries(AppDataSource);
    await seedSpecialties(AppDataSource);
    await seedClients(AppDataSource);
    await seedOperationList(AppDataSource);
    await seedWorkers(AppDataSource);
    await seedLicenses(AppDataSource);
    await seedWorkerShifts(AppDataSource, 0, 50);

    console.log('✅ Усі сидери відпрацювали успішно');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Помилка при запуску сидів:', error);
    await AppDataSource.destroy();
  }
}

runAllSeeds();
