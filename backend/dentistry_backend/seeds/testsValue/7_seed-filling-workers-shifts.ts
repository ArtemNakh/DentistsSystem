import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { WorkerShifts } from '../../src/worker-shifts/entities/worker-shifts.entity';
import { Worker } from '../../src/workers/entities/workers.entity';

export async function seedWorkerShifts(
  dataSource: DataSource,
  minShifts: number = 1,
  maxShifts: number = 3
) {
  const workerShiftsRepo = dataSource.getRepository(WorkerShifts);
  const workerRepo = dataSource.getRepository(Worker);

  const workers = await workerRepo.find();

  if (workers.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю workers!');
  }

  const shifts: WorkerShifts[] = [];

  for (const worker of workers) {
    // випадкова кількість змін для цього працівника
    const shiftsPerWorker = faker.number.int({ min: minShifts, max: maxShifts });

    for (let i = 0; i < shiftsPerWorker; i++) {
      const shiftDate = faker.date.soon({ days: 90 }); // дата протягом наступних 90 днів
      const startHour = faker.number.int({ min: 8, max: 15 }); // початок між 8:00 і 15:00
      const startTime = `${String(startHour).padStart(2, '0')}:00:00`;
      const endTime = `${String(startHour + 4).padStart(2, '0')}:00:00`; // кінець через 4 години

      const shift = workerShiftsRepo.create({
        worker,
        shift_date: shiftDate,
        start_time: startTime,
        end_time: endTime,
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
      });

      shifts.push(shift);
    }
  }

  await workerShiftsRepo.save(shifts);
  console.log(`✅ Згенеровано ${shifts.length} змін для ${workers.length} працівників`);
}
