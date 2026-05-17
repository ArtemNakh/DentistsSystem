"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppointmentActions = seedAppointmentActions;
const faker_1 = require("@faker-js/faker");
const appointment_action_entity_1 = require("../../../src/appointment-action/entity/appointment-action.entity");
const appointment_entity_1 = require("../../../src/appointment/entity/appointment.entity");
const operation_list_entity_1 = require("../../../src/operation-list/entities/operation-list.entity");
async function seedAppointmentActions(dataSource, minActions = 1, maxActions = 3) {
    const appointmentActionsRepo = dataSource.getRepository(appointment_action_entity_1.AppointmentActions);
    const appointmentRepo = dataSource.getRepository(appointment_entity_1.Appointment);
    const operationRepo = dataSource.getRepository(operation_list_entity_1.OperationList);
    const appointments = await appointmentRepo.find({
        relations: ['dentist', 'dentist.dentistry'],
    });
    const operations = await operationRepo.find({ relations: ['dental_clinic'] });
    if (appointments.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю appointments!');
    }
    if (operations.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю operation_list!');
    }
    const actions = [];
    for (const appointment of appointments) {
        const actionsPerAppointment = faker_1.faker.number.int({
            min: minActions,
            max: maxActions,
        });
        const clinicOperations = operations.filter((op) => op.dental_clinic.id === appointment.dentist.dentistry.id);
        if (clinicOperations.length === 0)
            continue;
        for (let i = 0; i < actionsPerAppointment; i++) {
            const operation = faker_1.faker.helpers.arrayElement(clinicOperations);
            const action = appointmentActionsRepo.create({
                appointment,
                operation,
                created_at: faker_1.faker.date.past({ years: 1 }),
                updated_at: new Date(),
            });
            actions.push(action);
        }
    }
    await appointmentActionsRepo.save(actions);
    console.log(`✅ Згенеровано ${actions.length} дій для ${appointments.length} прийомів`);
}
//# sourceMappingURL=9_seed-filling-appointments-actions.js.map