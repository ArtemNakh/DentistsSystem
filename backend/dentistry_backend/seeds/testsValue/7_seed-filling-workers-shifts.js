"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedWorkerShifts = seedWorkerShifts;
const faker_1 = require("@faker-js/faker");
const worker_shifts_entity_1 = require("../../src/worker-shifts/entities/worker-shifts.entity");
const workers_entity_1 = require("../../src/workers/entities/workers.entity");
async function seedWorkerShifts(dataSource, minShifts = 1, maxShifts = 3) {
    const workerShiftsRepo = dataSource.getRepository(worker_shifts_entity_1.WorkerShifts);
    const workerRepo = dataSource.getRepository(workers_entity_1.Worker);
    const workers = await workerRepo.find();
    if (workers.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю workers!');
    }
    const shifts = [];
    for (const worker of workers) {
        const shiftsPerWorker = faker_1.faker.number.int({ min: minShifts, max: maxShifts });
        for (let i = 0; i < shiftsPerWorker; i++) {
            const shiftDate = faker_1.faker.date.soon({ days: 90 });
            const startHour = faker_1.faker.number.int({ min: 8, max: 15 });
            const startTime = `${String(startHour).padStart(2, '0')}:00:00`;
            const endTime = `${String(startHour + 4).padStart(2, '0')}:00:00`;
            const shift = workerShiftsRepo.create({
                worker,
                shift_date: shiftDate,
                start_time: startTime,
                end_time: endTime,
                created_at: faker_1.faker.date.past({ years: 1 }),
                updated_at: new Date(),
            });
            shifts.push(shift);
        }
    }
    await workerShiftsRepo.save(shifts);
    console.log(`✅ Згенеровано ${shifts.length} змін для ${workers.length} працівників`);
}
//# sourceMappingURL=7_seed-filling-workers-shifts.js.map