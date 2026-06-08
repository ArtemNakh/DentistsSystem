import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { IPayment, StatusPayment } from './entity/payment.interface';
import { WorkersService } from '@/workers/workers.service';
import { DentistryService } from '@/dentistry/dentistry.service';
import { AppointmentService } from '@/appointment/appointment.service';
import { StatusAppointment } from '@/appointment/entity/appointment.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    private workersService: WorkersService,
    private dentistryService: DentistryService,
    private appointmentService: AppointmentService,
  ) {}

  findAll(): Promise<IPayment[]> {
    return this.paymentRepo.find({ relations: ['appointment'] });
  }

  async getPaymentsByDentist(
    workerId: number,
    take?: number,
    skip?: number,
  ): Promise<Payment[]> {
    // 1. Перевірка: чи передано workerId
    if (!workerId || isNaN(workerId)) {
      throw new BadRequestException('Invalid dentist (worker) ID');
    }

    // 2. Перевірка: чи існує лікар
    const dentist = await this.workersService.findById(workerId);

    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${workerId} not found`);
    }

    // 3. Отримання платежів
    const payments = await this.paymentRepo.find({
      where: { appointment: { dentist: { id: workerId } } },
      relations: [
        'appointment',
        'appointment.client',
        'appointment.dentist',
        'appointment.dentist.specialty',
        'appointment.dentist.dentistry',
        'appointment.appointment_actions',
        'appointment.appointment_actions.operation',
      ],
      order: { created_at: 'DESC' },
      take: take,
      skip: skip,
    });

    // 4. Перевірка: чи є платежі
    if (!payments.length) {
      throw new NotFoundException(
        `No payments found for dentist with ID ${workerId}`,
      );
    }

    return payments;
  }

  async getPaymentsByDentistry(
    dentistryId: number,
    take?: number,
    skip?: number,
  ): Promise<Payment[]> {
    // 1. Перевірка: чи передано ID
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException('Invalid dentistry ID');
    }

    // 2. Перевірка: чи існує стоматологія
    const dentistry = await this.dentistryService.getDentistryById(dentistryId);

    if (!dentistry) {
      throw new NotFoundException(`Dentistry with ID ${dentistryId} not found`);
    }

    // 3. Отримання платежів
    const payments = await this.paymentRepo.find({
      where: { appointment: { dentist: { dentistry: { id: dentistryId } } } },
      relations: [
        'appointment',
        'appointment.client',
        'appointment.dentist',
        'appointment.dentist.dentistry',
        'appointment.appointment_actions',
        'appointment.appointment_actions.operation',
      ],
      order: { created_at: 'DESC' },
      take: take,
      skip: skip,
    });

    // 4. Перевірка: чи є платежі
    if (!payments.length) {
      throw new NotFoundException(
        `No payments found for dentistry with ID ${dentistryId}`,
      );
    }

    return payments;
  }

  async CompletePayment(appointmentId: number) {
    if (!appointmentId || isNaN(appointmentId)) {
      throw new BadRequestException('Invalid appointment ID');
    }
    const appointment =
      await this.appointmentService.getAppointmentById(appointmentId);

    if (!appointment) {
      throw new BadRequestException(
        'Not found appointment by id ' + appointmentId,
      );
    }

    const payment = await this.paymentRepo.findOne({
      where: { appointment: { id: appointmentId } },
      relations: ['appointment'],
    });

    if (!payment) {
      throw new BadRequestException(
        'Not found payment by id ' + appointmentId + 'Please finish operation',
      );
    }

    payment.status_paid = StatusPayment.PAID;
    payment.appointment.status = StatusAppointment.COMPLETED;

    const newPayment = await this.paymentRepo.save(payment);
    return newPayment;
  }
}
