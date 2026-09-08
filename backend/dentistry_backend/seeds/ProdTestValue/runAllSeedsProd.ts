import AppDataSource from '../../src/database/data-source';
import { seedNotifications } from './seeders/10_seed-filling-notifications';
import { seedPayments } from './seeders/11_seed-filling-payments';
import { seedDentistries } from './seeders/1_seed-filling-dental-clinics';
import { seedSpecialties } from './seeders/2_seed-filling-specialties';
import { seedOperationList } from './seeders/3_seed-filling-operation-list';
import { seedClients } from './seeders/4_seed-filling-clients';
import { seedWorkers } from './seeders/5_seed-filling-worker';
import { seedLicenses } from './seeders/6_seed-filling-license';
import { seedWorkerShifts } from './seeders/7_seed-filling-workers-shifts';
import { seedAppointments } from './seeders/8_seed-filling-appointments';
import { seedAppointmentActions } from './seeders/9_seed-filling-appointments-actions';
  //запуск
    // npx ts-node ./seeds/ProdTestValue/runAllSeedsProd.ts

async function runAllSeeds() {
  try {
  

    await AppDataSource.initialize();

    const runSeed = async (fn: Function, ...args: any[]) => {
      try {
        await fn(AppDataSource, ...args);
        console.log(`✅ ${fn.name} відпрацював успішно`);
      } catch (error:any) {
        console.error(`❌ Помилка у ${fn.name}:`, error.message || error);
      }
    };

    await runSeed(seedDentistries, 5);
    await runSeed(seedSpecialties, 50);
    await runSeed(seedOperationList, 3, 15, 10, 1000);
    await runSeed(seedClients, 50);
    await runSeed(seedWorkers, 5, 30);
    await runSeed(seedLicenses, 2, 14);
    await runSeed(seedWorkerShifts, 10, 50);
    await runSeed(seedAppointments, 1, 25, 20, 50);
    await runSeed(seedAppointmentActions, 1, 10);
    await runSeed(seedNotifications);
    await runSeed(seedPayments);

    console.log('🎉 Усі сидери пройшли цикл виконання');
  } catch (error) {
    console.error('❌ Критична помилка при запуску сидів:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runAllSeeds();