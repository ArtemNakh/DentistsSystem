import { faker } from '@faker-js/faker';
import { Appointment } from '../../../src/appointment/entity/appointment.entity';
import { AppointmentActions } from '../../../src/appointment-action/entity/appointment-action.entity';
import { Payment } from '../../../src/payment/entity/payment.entity';
import { MethodPayment, StatusPayment } from '../../../src/payment/entity/payment.interface';
import { DataSource } from 'typeorm';

export async function seedPayments(dataSource: DataSource) {
  const paymentRepo = dataSource.getRepository(Payment);
  const appointmentRepo = dataSource.getRepository(Appointment);
  const appointmentActionsRepo = dataSource.getRepository(AppointmentActions);

  const appointments = await appointmentRepo.find();

  if (appointments.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю appointments!');
  }

  const payments: Payment[] = [];

  for (const appointment of appointments) {
    // перевіряємо чи прийом у минулому
    const now = new Date();
    if (appointment.appointment_date > now) {
      // майбутні прийоми не мають платежів
      continue;
    }

    // отримуємо всі дії для цього appointment
    const actions = await appointmentActionsRepo.find({
      where: { appointment: { id: appointment.id } },
      relations: ['operation'],
    });

    if (actions.length === 0) continue;

    // рахуємо суму всіх операцій
    const totalAmount = actions.reduce(
      (sum, action) => sum + (action.operation?.price || 0),
      0,
    );

    // створюємо платіж
    const payment = paymentRepo.create({
      appointment,
      amount: totalAmount,
      status_paid: faker.helpers.arrayElement([
        StatusPayment.PAID,
        StatusPayment.NOT_PAID,
        
      ]),
      method_pay: faker.helpers.arrayElement(Object.values(MethodPayment)),
      payment_date: faker.date.past({ years: 1 }),
      created_at: faker.date.past({ years: 1 }),
      updated_at: new Date(),
    });

    payments.push(payment);
  }

  await paymentRepo.save(payments);
  console.log(`✅ Згенеровано ${payments.length} платежів для минулих прийомів`);
}
