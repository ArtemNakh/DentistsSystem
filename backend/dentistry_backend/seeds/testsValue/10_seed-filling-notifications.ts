import { faker } from '@faker-js/faker';
import { Appointment } from '../../src/appointment/entity/appointment.entity';
import { Notification } from '../../src/notification/entity/notification.entity';
import { TypeRemaind } from '../../src/notification/entity/notification.interface';
import { DataSource } from 'typeorm';

export async function seedNotifications(
  dataSource: DataSource,
  minNotifications: number = 1,
  maxNotifications: number = 3
) {
  const notificationRepo = dataSource.getRepository(Notification);
  const appointmentRepo = dataSource.getRepository(Appointment);

  const appointments = await appointmentRepo.find();

  if (appointments.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю appointments!');
  }

  const notifications: Notification[] = [];

  for (const appointment of appointments) {
    // випадкова кількість нагадувань для цього прийому
    const notificationsPerAppointment = faker.number.int({
      min: minNotifications,
      max: maxNotifications,
    });

    for (let i = 0; i < notificationsPerAppointment; i++) {
      const notification = notificationRepo.create({
        appointment,
        message: faker.lorem.sentence(),
        is_send: faker.datatype.boolean(),
        type_remaind: faker.helpers.arrayElement(Object.values(TypeRemaind)),
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
      });

      notifications.push(notification);
    }
  }

  await notificationRepo.save(notifications);
  console.log(`✅ Згенеровано ${notifications.length} нагадувань для ${appointments.length} прийомів`);
}
