"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppointments = seedAppointments;
const faker_1 = require("@faker-js/faker");
const appointment_entity_1 = require("../../src/appointment/entity/appointment.entity");
const client_entity_1 = require("../../src/clients/entities/client.entity");
const workers_entity_1 = require("../../src/workers/entities/workers.entity");
const appointment_interface_1 = require("../../src/appointment/entity/appointment.interface");
async function seedAppointments(dataSource, minAppointments = 1, maxAppointments = 5) {
    const appointmentRepo = dataSource.getRepository(appointment_entity_1.Appointment);
    const clientRepo = dataSource.getRepository(client_entity_1.Client);
    const workerRepo = dataSource.getRepository(workers_entity_1.Worker);
    const clients = await clientRepo.find();
    const workers = await workerRepo.find();
    if (clients.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю clients!');
    }
    if (workers.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю workers!');
    }
    const appointments = [];
    for (const client of clients) {
        const appointmentsPerClient = faker_1.faker.number.int({ min: minAppointments, max: maxAppointments });
        for (let i = 0; i < appointmentsPerClient; i++) {
            const dentist = faker_1.faker.helpers.arrayElement(workers);
            const appointmentDate = faker_1.faker.date.soon({ days: 60 });
            const status = faker_1.faker.helpers.arrayElement([
                appointment_interface_1.StatusAppointment.SCHEDULE,
                appointment_interface_1.StatusAppointment.WAIT_PAID,
                appointment_interface_1.StatusAppointment.COMPLETED,
                appointment_interface_1.StatusAppointment.CANCELLED,
            ]);
            const appointment = appointmentRepo.create({
                client,
                dentist,
                appointment_date: appointmentDate,
                notes: faker_1.faker.lorem.sentence(),
                status,
                created_at: faker_1.faker.date.past({ years: 2 }),
                updated_at: new Date(),
            });
            appointments.push(appointment);
        }
    }
    await appointmentRepo.save(appointments);
    console.log(`✅ Згенеровано ${appointments.length} прийомів для ${clients.length} клієнтів`);
}
//# sourceMappingURL=8_seed-filling-appointments.js.map