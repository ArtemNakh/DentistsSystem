import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { AppointmentActions } from '../../../src/appointment-action/entity/appointment-action.entity';
import { Appointment } from '../../../src/appointment/entity/appointment.entity';
import { OperationList } from '../../../src/operation-list/entities/operation-list.entity';

export async function seedAppointmentActions(
  dataSource: DataSource,
  minActions: number = 1,
  maxActions: number = 3,
) {
  const appointmentActionsRepo = dataSource.getRepository(AppointmentActions);
  const appointmentRepo = dataSource.getRepository(Appointment);
  const operationRepo = dataSource.getRepository(OperationList);

  // отримуємо всі прийоми з лікарями та клініками
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

  const actions: AppointmentActions[] = [];

  for (const appointment of appointments) {
    
    // випадкова кількість дій для цього прийому
    const actionsPerAppointment = faker.number.int({
      min: minActions,
      max: maxActions,
    });

    // операції тільки з клініки лікаря цього appointment
    const clinicOperations = operations.filter(
      (op) => op.dental_clinic.id === appointment.dentist.dentistry.id,
    );
    if (clinicOperations.length === 0) continue;

    for (let i = 0; i < actionsPerAppointment; i++) {
      const operation = faker.helpers.arrayElement(clinicOperations);

      const action = appointmentActionsRepo.create({
        appointment,
        operation,
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
      });

      actions.push(action);
    }
  }

  await appointmentActionsRepo.save(actions);
  console.log(
    `✅ Згенеровано ${actions.length} дій для ${appointments.length} прийомів`,
  );
}
