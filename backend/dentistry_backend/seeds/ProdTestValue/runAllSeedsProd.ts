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

async function runAllSeeds() {
  try {
    //запуск
    //    npx ts-node ./src/seeds/index.ts

    await AppDataSource.initialize();

    await seedDentistries(AppDataSource,5);
    await seedSpecialties(AppDataSource, 50);
    await seedOperationList(AppDataSource, 3, 15, 10, 1000);
    await seedClients(AppDataSource, 50);
    await seedWorkers(AppDataSource, 5, 30);
    await seedLicenses(AppDataSource, 2, 14);
    await seedWorkerShifts(AppDataSource, 10, 50);
    await seedAppointments(AppDataSource, 1, 25, 20, 50);
    await seedAppointmentActions(AppDataSource, 1, 10);
    await seedNotifications(AppDataSource);
    await seedPayments(AppDataSource);

    console.log('✅ Усі сидери відпрацювали успішно');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Помилка при запуску сидів:', error);
    await AppDataSource.destroy();
  }
}

runAllSeeds();
