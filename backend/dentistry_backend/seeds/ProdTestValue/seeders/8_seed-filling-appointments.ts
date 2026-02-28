import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Appointment } from '../../../src/appointment/entity/appointment.entity';
import { Client } from '../../../src/clients/entities/client.entity';
import { Worker } from '../../../src/workers/entities/workers.entity';
import { WorkerShifts } from '../../../src/worker-shifts/entities/worker-shifts.entity';
import { OperationList } from '../../../src/operation-list/entities/operation-list.entity';
import { StatusAppointment } from '../../../src/appointment/entity/appointment.interface';
import { SpecialtyType } from '../../../src/specialty/entities/specialty.interface';

export async function seedAppointments(
  dataSource: DataSource,
  minAppointmentsPerClient: number = 1,
  maxAppointmentsPerClient: number = 5,
  minOperationsPerDoctor: number = 5,
  maxOperationsPerDoctor: number = 15,
) {
  const appointmentRepo = dataSource.getRepository(Appointment);
  const clientRepo = dataSource.getRepository(Client);
  const workerRepo = dataSource.getRepository(Worker);
  const shiftRepo = dataSource.getRepository(WorkerShifts);
  const operationRepo = dataSource.getRepository(OperationList);

  const clients = await clientRepo.find();
  const workers = await workerRepo.find({
    relations: ['specialty', 'dentistry'],
  });
  const shifts = await shiftRepo.find({ relations: ['worker'] });
  const operations = await operationRepo.find({ relations: ['dental_clinic'] });

  if (clients.length === 0) throw new Error('❌ Спочатку засідай clients!');
  if (workers.length === 0) throw new Error('❌ Спочатку засідай workers!');
  if (shifts.length === 0)
    throw new Error('❌ Спочатку засідай worker_shifts!');
  if (operations.length === 0)
    throw new Error('❌ Спочатку засідай operation_list!');

  const appointments: Appointment[] = [];

  // --- Для кожного клієнта ---
  for (const client of clients) {
    const appointmentsPerClient = faker.number.int({
      min: minAppointmentsPerClient,
      max: maxAppointmentsPerClient,
    });

    for (let i = 0; i < appointmentsPerClient; i++) {
      const doctor = faker.helpers.arrayElement(
        workers.filter((w) => w.specialty?.type === SpecialtyType.DOCTOR),
      );
      const doctorShifts = shifts.filter((s) => s.worker.id === doctor.id);
      if (doctorShifts.length === 0) continue;

      const shift = faker.helpers.arrayElement(doctorShifts);
      const clinicOperations = operations.filter(
        (op) => op.dental_clinic.id === doctor.dentistry.id,
      );
      if (clinicOperations.length === 0) continue;

      const operation = faker.helpers.arrayElement(clinicOperations);

      const startHour = Number(shift.start_time.split(':')[0]);
      const endHour = Number(shift.end_time.split(':')[0]);
      const appointmentHour = faker.number.int({
        min: startHour,
        max: endHour - 1,
      });

      const appointmentDate = shift.shift_date;
      const appointmentTime = new Date(appointmentDate);
      appointmentTime.setHours(appointmentHour, 0, 0, 0);

      const status = faker.helpers.arrayElement([
        StatusAppointment.SCHEDULE,
        StatusAppointment.WAIT_PAID,
        StatusAppointment.COMPLETED,
        StatusAppointment.CANCELLED,
      ]);

      const appointment = appointmentRepo.create({
        client,
        dentist: doctor,
        appointment_date: appointmentTime,
        notes: faker.lorem.sentence(),
        status,
        created_at: faker.date.past({ years: 2 }),
        updated_at: new Date(),
      });

      appointments.push(appointment);
    }
  }

  // --- Для кожного доктора ---
  for (const doctor of workers.filter(
    (w) => w.specialty?.type === SpecialtyType.DOCTOR,
  )) {
    const doctorShifts = shifts.filter((s) => s.worker.id === doctor.id);
    if (doctorShifts.length === 0) continue;

    // випадкова кількість операцій для цього доктора
    const operationsCount = faker.number.int({
      min: minOperationsPerDoctor,
      max: maxOperationsPerDoctor,
    });

    for (let i = 0; i < operationsCount; i++) {
      const shift = faker.helpers.arrayElement(doctorShifts);
      const clinicOperations = operations.filter(
        (op) => op.dental_clinic.id === doctor.dentistry.id,
      );
      if (clinicOperations.length === 0) continue;

      const operation = faker.helpers.arrayElement(clinicOperations);
      const client = faker.helpers.arrayElement(clients);

      const startHour = Number(shift.start_time.split(':')[0]);
      const endHour = Number(shift.end_time.split(':')[0]);
      const appointmentHour = faker.number.int({
        min: startHour,
        max: endHour - 1,
      });

      const appointmentDate = shift.shift_date;
      const appointmentTime = new Date(appointmentDate);
      appointmentTime.setHours(appointmentHour, 0, 0, 0);

      const status = faker.helpers.arrayElement([
        StatusAppointment.SCHEDULE,
        StatusAppointment.WAIT_PAID,
        StatusAppointment.COMPLETED,
        StatusAppointment.CANCELLED,
      ]);

      const appointment = appointmentRepo.create({
        client,
        dentist: doctor,
        appointment_date: appointmentTime,
        notes: faker.lorem.sentence(),
        status,
        created_at: faker.date.past({ years: 2 }),
        updated_at: new Date(),
      });

      appointments.push(appointment);
    }

    console.log(
      `✅ Для доктора #${doctor.id} згенеровано ${operationsCount} прийомів`,
    );
  }

  await appointmentRepo.save(appointments);
  console.log(`🎉 Всього згенеровано ${appointments.length} прийомів`);
}
