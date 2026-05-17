import { Injectable, NotFoundException } from '@nestjs/common';
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

  
  async addActionsAndPayment(dto: CreateAppointmentActionsDto) {
  return await this.dataSource.transaction(async (manager) => {
    const appointmentRepo = manager.getRepository(Appointment);
    const operationRepo = manager.getRepository(OperationList);
    const appointmentActionRepo = manager.getRepository(AppointmentActions);
    const paymentRepo = manager.getRepository(Payment);

    // 1. Отримуємо appointment
    const appointment = await appointmentRepo.findOne({
      where: { id: dto.appointmentId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    // 2. Отримуємо всі операції
    const operations = await operationRepo.findBy({ id: In(dto.actions) });
    if (operations.length !== dto.actions.length) {
      throw new NotFoundException('Some operations not found');
    }

    // 3. Створюємо appointment_actions
    const appointmentActions = operations.map((operation) =>
      appointmentActionRepo.create({ appointment, operation }),
    );
    await appointmentActionRepo.save(appointmentActions);

    // 4. Рахуємо суму
    const totalAmount = operations.reduce((sum, op) => sum + op.price, 0);

    // 5. Створюємо або оновлюємо payment
    let payment: Payment;
    const existingPayment = await paymentRepo.findOne({
      where: { appointment: { id: appointment.id } },
    });
    if (existingPayment) {
      existingPayment.amount = totalAmount;
      existingPayment.method_pay = dto.method_pay;
      existingPayment.status_paid = StatusPayment.NOT_PAID;
      existingPayment.payment_date = new Date();
      payment = await paymentRepo.save(existingPayment);
    } else {
      payment = paymentRepo.create({
        appointment,
        amount: totalAmount,
        status_paid: StatusPayment.NOT_PAID,
        method_pay: dto.method_pay,
        payment_date: new Date(),
      });
      payment = await paymentRepo.save(payment);
    }

    // 6. Оновлюємо статус appointment
    appointment.status = StatusAppointment.WAIT_PAID;
    await appointmentRepo.save(appointment);

    return { appointment, actions: appointmentActions, payment };
  });
}
}
