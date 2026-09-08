import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentActions } from './entity/appointment-action.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAppointmentActions } from './entity/appointment-action.interface';
import { Appointment } from '@/appointment/entity/appointment.entity';
import { Payment } from '@/payment/entity/payment.entity';
import { OperationList } from '@/operation-list/entities/operation-list.entity';
import { CreateAppointmentActionsDto } from './dto/CreateAppointmentActionsDto';
import { StatusPayment } from '@/payment/entity/payment.interface';
import { StatusAppointment } from '@/appointment/entity/appointment.interface';

@Injectable()
export class AppointmentActionService {
  constructor(
    @InjectRepository(AppointmentActions)
    private appointmentActionRepo: Repository<AppointmentActions>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(OperationList)
    private operationRepo: Repository<OperationList>,
    private dataSource: DataSource,
  ) {}

  findAll(): Promise<IAppointmentActions[]> {
    return this.appointmentActionRepo.find({
      relations: ['appointment', 'operation'],
    });
  }

  async addActionsAndPayment(dto: CreateAppointmentActionsDto,workerId:number) {
    return await this.dataSource.transaction(async (manager) => {
      const appointmentRepo = manager.getRepository(Appointment);
      const operationRepo = manager.getRepository(OperationList);
      const appointmentActionRepo = manager.getRepository(AppointmentActions);
      const paymentRepo = manager.getRepository(Payment);

      // 1. Отримуємо appointment
      const appointment = await appointmentRepo.findOne({
        where: { id: dto.appointmentId },
        relations: ['dentist', 'dentist.dentistry'],
      });
      if (!appointment) throw new NotFoundException('Appointment not found');
      if (appointment.dentist.id !== workerId) {
        throw new ForbiddenException(
          'Only the doctor assigned to this appointment can add actions',
        );
      }
      // 2. Перевірка: чи вже існують appointment_actions для цього appointment
      const existingActions = await appointmentActionRepo.find({
        where: { appointment: { id: appointment.id } },
        relations: ['operation'],
      });

      if (existingActions.length > 0) {
        throw new BadRequestException(
          'Appointment already has assigned operations',
        );
      }

      const activeOperation: boolean = true;
      // 3. Отримуємо всі операції
      const operations = await operationRepo.find({
        where: { id: In(dto.actions), active: activeOperation },
        relations: ['dental_clinic'],
      });
      if (operations.length !== dto.actions.length) {
        throw new NotFoundException('Some operations not found');
      }

      // 3.1 Перевірка: операції повинні належати стоматології лікаря
      const invalidOperations = operations.filter(
        (op) => op.dental_clinic?.id !== appointment.dentist.dentistry.id,
      );
      if (invalidOperations.length > 0) {
        throw new BadRequestException(
          `Some operations do not belong to this dentistry: ${invalidOperations
            .map((o) => o.id)
            .join(', ')}`,
        );
      }

      // 4. Перевірка: чи існує payment для цього appointment
      const existingPayment = await paymentRepo.findOne({
        where: { appointment: { id: appointment.id } },
      });

      if (existingPayment) {
        throw new BadRequestException(
          'Payment for this appointment already exists',
        );
      }

      // 5. Створюємо appointment_actions
      const appointmentActions = operations.map((operation) =>
        appointmentActionRepo.create({ appointment, operation }),
      );
      await appointmentActionRepo.save(appointmentActions);

      // 6. Рахуємо суму
      const totalAmount = operations.reduce((sum, op) => sum + op.price, 0);

      // 7. Створюємо payment
      const payment = await paymentRepo.save(
        paymentRepo.create({
          appointment,
          amount: totalAmount,
          status_paid: StatusPayment.NOT_PAID,
          method_pay: dto.method_pay,
          payment_date: new Date(),
        }),
      );

      // 6. Оновлюємо статус appointment
      appointment.status = StatusAppointment.WAIT_PAID;
      await appointmentRepo.save(appointment);

      return { appointment, actions: appointmentActions, payment };
    });
  }
}
