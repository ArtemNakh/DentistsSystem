"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPayments = seedPayments;
const faker_1 = require("@faker-js/faker");
const appointment_entity_1 = require("../../../src/appointment/entity/appointment.entity");
const appointment_action_entity_1 = require("../../../src/appointment-action/entity/appointment-action.entity");
const payment_entity_1 = require("../../../src/payment/entity/payment.entity");
const payment_interface_1 = require("../../../src/payment/entity/payment.interface");
async function seedPayments(dataSource) {
    const paymentRepo = dataSource.getRepository(payment_entity_1.Payment);
    const appointmentRepo = dataSource.getRepository(appointment_entity_1.Appointment);
    const appointmentActionsRepo = dataSource.getRepository(appointment_action_entity_1.AppointmentActions);
    const appointments = await appointmentRepo.find();
    if (appointments.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю appointments!');
    }
    const payments = [];
    for (const appointment of appointments) {
        const now = new Date();
        if (appointment.appointment_date > now) {
            continue;
        }
        const actions = await appointmentActionsRepo.find({
            where: { appointment: { id: appointment.id } },
            relations: ['operation'],
        });
        if (actions.length === 0)
            continue;
        const totalAmount = actions.reduce((sum, action) => sum + (action.operation?.price || 0), 0);
        const payment = paymentRepo.create({
            appointment,
            amount: totalAmount,
            status_paid: faker_1.faker.helpers.arrayElement([
                payment_interface_1.StatusPayment.PAID,
                payment_interface_1.StatusPayment.NOT_PAID,
            ]),
            method_pay: faker_1.faker.helpers.arrayElement(Object.values(payment_interface_1.MethodPayment)),
            payment_date: faker_1.faker.date.past({ years: 1 }),
            created_at: faker_1.faker.date.past({ years: 1 }),
            updated_at: new Date(),
        });
        payments.push(payment);
    }
    await paymentRepo.save(payments);
    console.log(`✅ Згенеровано ${payments.length} платежів для минулих прийомів`);
}
//# sourceMappingURL=11_seed-filling-payments.js.map