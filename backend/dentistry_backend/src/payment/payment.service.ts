import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { IPayment } from './entity/payment.interface';
import { WorkersService } from '@/workers/workers.service';
import { DentistryService } from '@/dentistry/dentistry.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    private workersService: WorkersService,
    private dentistryService: DentistryService,
  ) {}

  findAll(): Promise<IPayment[]> {
    return this.paymentRepo.find({ relations: ['appointment'] });
  }

  async getPaymentsByDentist(workerId: number): Promise<Payment[]> {
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
    });

    // 4. Перевірка: чи є платежі
    if (!payments.length) {
      throw new NotFoundException(
        `No payments found for dentist with ID ${workerId}`,
      );
    }

    return payments;
  }

  async getPaymentsByDentistry(dentistryId: number): Promise<Payment[]> {
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
    });

    // 4. Перевірка: чи є платежі
    if (!payments.length) {
      throw new NotFoundException(
        `No payments found for dentistry with ID ${dentistryId}`,
      );
    }

    return payments;
  }
}
