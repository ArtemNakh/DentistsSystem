import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { WorkerShifts } from '../../../src/worker-shifts/entities/worker-shifts.entity';
import { Worker } from '../../../src/workers/entities/workers.entity';

export async function seedWorkerShifts(
  dataSource: DataSource,
  minShifts: number = 5,
  maxShifts: number = 15
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
      // випадково: зміна у минулому чи майбутньому
      const isFuture = faker.datatype.boolean();
      const shiftDate = isFuture
        ? faker.date.soon({ days: 150 }) // майбутнє до 90 днів
        : faker.date.recent({ days: 210 }); // минуле до 90 днів

      // випадковий початок роботи (між 7:00 і 15:00)
      const startHour = faker.number.int({ min: 7, max: 15 });
      // випадкова тривалість (від 3 до 10 годин)
      const duration = faker.number.int({ min: 3, max: 10 });
      const endHour = startHour + duration;

      const startTime = `${String(startHour).padStart(2, '0')}:00:00`;
      const endTime = `${String(endHour).padStart(2, '0')}:00:00`;

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

    console.log(
      `✅ Для працівника #${worker.id} (${worker.surname} ${worker.name}) згенеровано ${shiftsPerWorker} змін`,
    );
  }

  await workerShiftsRepo.save(shifts);
  console.log(`🎉 Всього згенеровано ${shifts.length} змін для ${workers.length} працівників`);
}
