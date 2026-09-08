import { faker } from '@faker-js/faker';
import { Appointment } from '../../../src/appointment/entity/appointment.entity';
import { Notification } from '../../../src/notification/entity/notification.entity';
import { TypeRemaind } from '../../../src/notification/entity/notification.interface';
import { DataSource } from 'typeorm';

export async function seedNotifications(
  dataSource: DataSource,
  minNotifications: number = 1,
  maxNotifications: number = 3
) {
  const notificationRepo = dataSource.getRepository(Notification);
  const appointmentRepo = dataSource.getRepository(Appointment);

  const appointments = await appointmentRepo.find({
    relations: ['appointment_actions', 'dentist'],
  });

  if (appointments.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю appointments!');
  }

  const notifications: Notification[] = [];

  for (const appointment of appointments) {
    // --- Обов’язкове нагадування за день до прийому ---
    const reminderDate = new Date(appointment.appointment_date);
    reminderDate.setDate(reminderDate.getDate() - 1);

    const mandatoryNotification = notificationRepo.create({
      appointment,
      message: `Нагадування: завтра у вас операція "${appointment.notes}" у лікаря ${appointment.dentist?.surname}`,
      is_send: false,
      type_remaind: TypeRemaind.APPOINTMENT_REMINDER, // наприклад, спеціальний тип для операцій
      created_at: new Date(),
      updated_at: new Date(),
    });

    notifications.push(mandatoryNotification);

    // --- Додаткові випадкові сповіщення ---
    const notificationsPerAppointment = faker.number.int({
      min: minNotifications,
      max: maxNotifications,
    });

    for (let i = 0; i < notificationsPerAppointment; i++) {
      // випадково: сповіщення у минулому чи майбутньому
      const isFuture = faker.datatype.boolean();
      const notifyDate = isFuture
        ? faker.date.soon({ days: 30 })
        : faker.date.recent({ days: 30 });

      const notification = notificationRepo.create({
        appointment,
        message: faker.lorem.sentence(),
        is_send: faker.datatype.boolean(),
        type_remaind: faker.helpers.arrayElement(Object.values(TypeRemaind)),
        created_at: notifyDate,
        updated_at: new Date(),
      });

      notifications.push(notification);
    }
  }

  await notificationRepo.save(notifications);
  console.log(
    `✅ Згенеровано ${notifications.length} сповіщень для ${appointments.length} прийомів`,
  );
}
