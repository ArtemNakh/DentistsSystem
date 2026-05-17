"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppointments = seedAppointments;
const faker_1 = require("@faker-js/faker");
const appointment_entity_1 = require("../../../src/appointment/entity/appointment.entity");
const client_entity_1 = require("../../../src/clients/entities/client.entity");
const workers_entity_1 = require("../../../src/workers/entities/workers.entity");
const worker_shifts_entity_1 = require("../../../src/worker-shifts/entities/worker-shifts.entity");
const operation_list_entity_1 = require("../../../src/operation-list/entities/operation-list.entity");
const appointment_interface_1 = require("../../../src/appointment/entity/appointment.interface");
const specialty_interface_1 = require("../../../src/specialty/entities/specialty.interface");
async function seedAppointments(dataSource, minAppointmentsPerClient = 1, maxAppointmentsPerClient = 5, minOperationsPerDoctor = 5, maxOperationsPerDoctor = 15) {
    const appointmentRepo = dataSource.getRepository(appointment_entity_1.Appointment);
    const clientRepo = dataSource.getRepository(client_entity_1.Client);
    const workerRepo = dataSource.getRepository(workers_entity_1.Worker);
    const shiftRepo = dataSource.getRepository(worker_shifts_entity_1.WorkerShifts);
    const operationRepo = dataSource.getRepository(operation_list_entity_1.OperationList);
    const clients = await clientRepo.find();
    const workers = await workerRepo.find({
        relations: ['specialty', 'dentistry'],
    });
    const shifts = await shiftRepo.find({ relations: ['worker'] });
    const operations = await operationRepo.find({ relations: ['dental_clinic'] });
    if (clients.length === 0)
        throw new Error('❌ Спочатку засідай clients!');
    if (workers.length === 0)
        throw new Error('❌ Спочатку засідай workers!');
    if (shifts.length === 0)
        throw new Error('❌ Спочатку засідай worker_shifts!');
    if (operations.length === 0)
        throw new Error('❌ Спочатку засідай operation_list!');
    const appointments = [];
    for (const client of clients) {
        const appointmentsPerClient = faker_1.faker.number.int({
            min: minAppointmentsPerClient,
            max: maxAppointmentsPerClient,
        });
        for (let i = 0; i < appointmentsPerClient; i++) {
            const doctor = faker_1.faker.helpers.arrayElement(workers.filter((w) => w.specialty?.type === specialty_interface_1.SpecialtyType.DOCTOR));
            const doctorShifts = shifts.filter((s) => s.worker.id === doctor.id);
            if (doctorShifts.length === 0)
                continue;
            const shift = faker_1.faker.helpers.arrayElement(doctorShifts);
            const clinicOperations = operations.filter((op) => op.dental_clinic.id === doctor.dentistry.id);
            if (clinicOperations.length === 0)
                continue;
            const operation = faker_1.faker.helpers.arrayElement(clinicOperations);
            const startHour = Number(shift.start_time.split(':')[0]);
            const endHour = Number(shift.end_time.split(':')[0]);
            const appointmentHour = faker_1.faker.number.int({
                min: startHour,
                max: endHour - 1,
            });
            const appointmentDate = shift.shift_date;
            const appointmentTime = new Date(appointmentDate);
            appointmentTime.setHours(appointmentHour, 0, 0, 0);
            const status = faker_1.faker.helpers.arrayElement([
                appointment_interface_1.StatusAppointment.SCHEDULE,
                appointment_interface_1.StatusAppointment.WAIT_PAID,
                appointment_interface_1.StatusAppointment.COMPLETED,
                appointment_interface_1.StatusAppointment.CANCELLED,
            ]);
            const appointment = appointmentRepo.create({
                client,
                dentist: doctor,
                appointment_date: appointmentTime,
                notes: faker_1.faker.lorem.sentence(),
                status,
                created_at: faker_1.faker.date.past({ years: 2 }),
                updated_at: new Date(),
            });
            appointments.push(appointment);
        }
    }
    for (const doctor of workers.filter((w) => w.specialty?.type === specialty_interface_1.SpecialtyType.DOCTOR)) {
        const doctorShifts = shifts.filter((s) => s.worker.id === doctor.id);
        if (doctorShifts.length === 0)
            continue;
        const operationsCount = faker_1.faker.number.int({
            min: minOperationsPerDoctor,
            max: maxOperationsPerDoctor,
        });
        for (let i = 0; i < operationsCount; i++) {
            const shift = faker_1.faker.helpers.arrayElement(doctorShifts);
            const clinicOperations = operations.filter((op) => op.dental_clinic.id === doctor.dentistry.id);
            if (clinicOperations.length === 0)
                continue;
            const operation = faker_1.faker.helpers.arrayElement(clinicOperations);
            const client = faker_1.faker.helpers.arrayElement(clients);
            const startHour = Number(shift.start_time.split(':')[0]);
            const endHour = Number(shift.end_time.split(':')[0]);
            const appointmentHour = faker_1.faker.number.int({
                min: startHour,
                max: endHour - 1,
            });
            const appointmentDate = shift.shift_date;
            const appointmentTime = new Date(appointmentDate);
            appointmentTime.setHours(appointmentHour, 0, 0, 0);
            const status = faker_1.faker.helpers.arrayElement([
                appointment_interface_1.StatusAppointment.SCHEDULE,
                appointment_interface_1.StatusAppointment.WAIT_PAID,
                appointment_interface_1.StatusAppointment.COMPLETED,
                appointment_interface_1.StatusAppointment.CANCELLED,
            ]);
            const appointment = appointmentRepo.create({
                client,
                dentist: doctor,
                appointment_date: appointmentTime,
                notes: faker_1.faker.lorem.sentence(),
                status,
                created_at: faker_1.faker.date.past({ years: 2 }),
                updated_at: new Date(),
            });
            appointments.push(appointment);
        }
        console.log(`✅ Для доктора #${doctor.id} згенеровано ${operationsCount} прийомів`);
    }
    await appointmentRepo.save(appointments);
    console.log(`🎉 Всього згенеровано ${appointments.length} прийомів`);
}
//# sourceMappingURL=8_seed-filling-appointments.js.map