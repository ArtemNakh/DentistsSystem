import { faker } from '@faker-js/faker';
import { Appointment } from '../../src/appointment/entity/appointment.entity';
import { Payment } from '../../src/payment/entity/payment.entity';
import { MethodPayment, StatusPayment } from '../../src/payment/entity/payment.interface';
import { DataSource } from 'typeorm';

export async function seedPayments(
  dataSource: DataSource,
) {
  const paymentRepo = dataSource.getRepository(Payment);
  const appointmentRepo = dataSource.getRepository(Appointment);

  const appointments = await appointmentRepo.find();

  if (appointments.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю appointments!');
  }

  const payments: Payment[] = [];

  for (const appointment of appointments) {
    // випадкова кількість платежів для цього прийому
   

    
      const payment = paymentRepo.create({
        appointment,
        amount: faker.number.int({ min: 100, max: 5000 }), // випадкова сума
        status_paid: faker.helpers.arrayElement(Object.values(StatusPayment)),
        method_pay: faker.helpers.arrayElement(Object.values(MethodPayment)),
        payment_date: faker.date.past({ years: 1 }),
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
      });

      payments.push(payment);
    
  }

  await paymentRepo.save(payments);
  console.log(`✅ Згенеровано ${payments.length} платежів для ${appointments.length} прийомів`);
}
