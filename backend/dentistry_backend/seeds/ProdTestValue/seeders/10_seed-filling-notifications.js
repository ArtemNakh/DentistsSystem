"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedNotifications = seedNotifications;
const faker_1 = require("@faker-js/faker");
const appointment_entity_1 = require("../../../src/appointment/entity/appointment.entity");
const notification_entity_1 = require("../../../src/notification/entity/notification.entity");
const notification_interface_1 = require("../../../src/notification/entity/notification.interface");
async function seedNotifications(dataSource, minNotifications = 1, maxNotifications = 3) {
    const notificationRepo = dataSource.getRepository(notification_entity_1.Notification);
    const appointmentRepo = dataSource.getRepository(appointment_entity_1.Appointment);
    const appointments = await appointmentRepo.find({
        relations: ['appointment_actions', 'dentist'],
    });
    if (appointments.length === 0) {
        throw new Error('❌ Спочатку засідай таблицю appointments!');
    }
    const notifications = [];
    for (const appointment of appointments) {
        const reminderDate = new Date(appointment.appointment_date);
        reminderDate.setDate(reminderDate.getDate() - 1);
        const mandatoryNotification = notificationRepo.create({
            appointment,
            message: `Нагадування: завтра у вас операція "${appointment.notes}" у лікаря ${appointment.dentist?.surname}`,
            is_send: false,
            type_remaind: notification_interface_1.TypeRemaind.APPOINTMENT_REMINDER,
            created_at: new Date(),
            updated_at: new Date(),
        });
        notifications.push(mandatoryNotification);
        const notificationsPerAppointment = faker_1.faker.number.int({
            min: minNotifications,
            max: maxNotifications,
        });
        for (let i = 0; i < notificationsPerAppointment; i++) {
            const isFuture = faker_1.faker.datatype.boolean();
            const notifyDate = isFuture
                ? faker_1.faker.date.soon({ days: 30 })
                : faker_1.faker.date.recent({ days: 30 });
            const notification = notificationRepo.create({
                appointment,
                message: faker_1.faker.lorem.sentence(),
                is_send: faker_1.faker.datatype.boolean(),
                type_remaind: faker_1.faker.helpers.arrayElement(Object.values(notification_interface_1.TypeRemaind)),
                created_at: notifyDate,
                updated_at: new Date(),
            });
            notifications.push(notification);
        }
    }
    await notificationRepo.save(notifications);
    console.log(`✅ Згенеровано ${notifications.length} сповіщень для ${appointments.length} прийомів`);
}
//# sourceMappingURL=10_seed-filling-notifications.js.map