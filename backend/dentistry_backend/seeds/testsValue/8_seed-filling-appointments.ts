import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Appointment } from '../../src/appointment/entity/appointment.entity';
import { Client } from '../../src/clients/entities/client.entity';
import { Worker } from '../../src/workers/entities/workers.entity';
import { StatusAppointment } from '../../src/appointment/entity/appointment.interface';

export async function seedAppointments(
  dataSource: DataSource,
  minAppointments: number = 1,
  maxAppointments: number = 5
) {
  const appointmentRepo = dataSource.getRepository(Appointment);
  const clientRepo = dataSource.getRepository(Client);
  const workerRepo = dataSource.getRepository(Worker);

  const clients = await clientRepo.find();
  const workers = await workerRepo.find();

  if (clients.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю clients!');
  }
  if (workers.length === 0) {
    throw new Error('❌ Спочатку засідай таблицю workers!');
  }

  const appointments: Appointment[] = [];

  for (const client of clients) {
    // випадкова кількість прийомів для цього клієнта
    const appointmentsPerClient = faker.number.int({ min: minAppointments, max: maxAppointments });

    for (let i = 0; i < appointmentsPerClient; i++) {
      const dentist = faker.helpers.arrayElement(workers); // випадковий лікар
      const appointmentDate = faker.date.soon({ days: 60 }); // дата протягом наступних 60 днів
      const status = faker.helpers.arrayElement([
        StatusAppointment.SCHEDULE,
        StatusAppointment.WAIT_PAID,
        StatusAppointment.COMPLETED,
        StatusAppointment.CANCELLED,
      ]);

      const appointment = appointmentRepo.create({
        client,
        dentist,
        appointment_date: appointmentDate,
        notes: faker.lorem.sentence(),
        status,
        created_at: faker.date.past({ years: 2 }),
        updated_at: new Date(),
      });

      appointments.push(appointment);
    }
  }

  await appointmentRepo.save(appointments);
  console.log(`✅ Згенеровано ${appointments.length} прийомів для ${clients.length} клієнтів`);
}
