import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { License } from './entities/license.entity';
import { Between, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILicense } from './entities/license.interface';
import { CreateLicenseDto } from './dto/CreateLicense.dto';
import { Worker } from '@/workers/entities/workers.entity';
import { UpdateLicenseDto } from './dto/UpdateLicense.dto';
import { DentistryModule } from '@/dentistry/dentistry.module';
import { DentistryService } from '@/dentistry/dentistry.service';
import { WorkersService } from '@/workers/workers.service';
@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License) private licenseRepo: Repository<License>,
    @InjectRepository(Worker) private readonly workerRepo: Repository<Worker>,

    private readonly dentistryService: DentistryService,
    private readonly workerService: WorkersService,
  ) {}
  /**
   * Отримати список усіх ліцензій.
   * @returns Масив ліцензій з інформацією про працівника
   */
  findAll(): Promise<ILicense[]> {
    return this.licenseRepo.find({ relations: ['worker'] });
  }

  /**
   * Створити нову ліцензію для працівника.
   * Виконує перевірку на існування працівника та дублювання номера ліцензії.
   * @param dto - DTO з даними для створення ліцензії
   * @throws NotFoundException якщо працівника не знайдено
   * @throws ConflictException якщо ліцензія з таким номером вже існує для цього працівника
   * @returns Створена ліцензія
   */
  async createLicense(dto: CreateLicenseDto): Promise<License> {
    const worker = await this.workerRepo.findOne({
      where: { id: dto.workerId },
    });
    if (!worker) throw new NotFoundException('Worker not found');
    // Перевірка на дублювання ліцензії для цього працівника
    const existingLicense = await this.licenseRepo.findOne({
      where: {
        number_license: dto.number_license,
        worker: { id: dto.workerId },
      },
      relations: ['worker'],
    });

    if (existingLicense) {
      throw new ConflictException(
        `License with number "${dto.number_license}" already exists for this worker`,
      );
    }

    const license = this.licenseRepo.create({ ...dto, worker });
    return this.licenseRepo.save(license);
  }

  /**
   * Оновити існуючу ліцензію.
   * Виконує перевірку на існування ліцензії та дублювання номера.
   * @param id - ID ліцензії
   * @param dto - DTO з новими даними
   * @throws NotFoundException якщо ліцензію не знайдено
   * @throws ConflictException якщо ліцензія з таким номером вже існує для цього працівника
   * @returns Оновлена ліцензія
   */
  async updateLicense(id: number, dto: UpdateLicenseDto): Promise<License> {
    const license = await this.licenseRepo.findOne({
      where: { id },
      relations: ['worker'],
    });
    if (!license) throw new NotFoundException('License not found');
    // Перевірка на дублювання (номер ліцензії + працівник)
    if (dto.number_license) {
      const existingLicense = await this.licenseRepo.findOne({
        where: {
          number_license: dto.number_license,
          worker: { id: license.worker.id },
        },
        relations: ['worker'],
      });

      if (existingLicense && existingLicense.id !== id) {
        throw new ConflictException(
          `License with number "${dto.number_license}" already exists for this worker`,
        );
      }
    }
    Object.assign(license, dto);
    return this.licenseRepo.save(license);
  }

  /**
   * Видалити ліцензію.
   * @param id - ID ліцензії
   * @throws NotFoundException якщо ліцензію не знайдено
   * @returns Об’єкт з success=true та повідомленням
   */
  async removeLicense(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const license = await this.licenseRepo.findOne({ where: { id } });
    if (!license) throw new NotFoundException('License not found');

    await this.licenseRepo.remove(license);
    return {
      success: true,
      message: `License with id ${id} has been deleted successfully`,
    };
  }

  /**
   * Отримати всі ліцензії стоматології.
   * @param dentistryId - ID стоматології
   * @throws NotFoundException якщо стоматологію не знайдено
   * @returns Масив ліцензій з інформацією про працівників
   */
  async getLicensesByDentistry(
    dentistryId: number,
    take?: number,
    skip?: number,
  ): Promise<ILicense[]> {
    await this.dentistryService.getDentistryById(dentistryId);

    return this.licenseRepo
      .createQueryBuilder('license')
      .leftJoinAndSelect('license.worker', 'worker')
      .leftJoinAndSelect('worker.dentistry', 'dentistry')
      .leftJoinAndSelect('worker.specialty', 'specialty')
      .where('dentistry.id = :dentistryId', { dentistryId })
      .orderBy('license.created_at', 'DESC')
      .take(take ?? undefined)
      .skip(skip ?? undefined)
      .getMany();
  }

  /**
   * Отримати всі ліцензії працівника за його ID.
   * @param workerId - ID працівника
   * @throws NotFoundException якщо працівника не знайдено
   * @returns Масив ліцензій цього працівника
   */
  async getLicensesByWorkerId(workerId: number): Promise<License[]> {
    const worker = await this.workerRepo.findOne({ where: { id: workerId } });
    if (!worker) {
      throw new NotFoundException(`Працівника з id=${workerId} не знайдено`);
    }

    const licenses = await this.licenseRepo.find({
      where: { worker: { id: workerId } },
      relations: ['worker'],
    });

    return licenses;
  }

  /**
   * Знайти ліцензії працівника, що закінчуються протягом maxDays.
   * @param workerId - ID працівника
   * @param maxDays - кількість днів для перевірки
   * @throws NotFoundException якщо працівника не знайдено
   * @returns Масив ліцензій, що закінчуються у вказаний період
   */
  async findExpiringLicensesByWorker(
    workerId: number,
    maxDays: number,
  ): Promise<ILicense[]> {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxDays);
    await this.workerService.findById(workerId);
    return this.licenseRepo.find({
      where: {
        worker: { id: workerId },
        expiration_date: Between(today, maxDate),
      },
      relations: ['worker', 'worker.specialty', 'worker.dentistry'],
      order: { expiration_date: 'ASC' },
    });
  }

  /**
   * Знайти ліцензії стоматології, що закінчуються протягом maxDays.
   * @param dentistryId - ID стоматології
   * @param maxDays - кількість днів для перевірки
   * @throws NotFoundException якщо стоматологію не знайдено
   * @returns Масив ліцензій, що закінчуються у вказаний період
   */
  async findExpiringLicensesByDentistry(
    dentistryId: number,
    maxDays: number,
  ): Promise<ILicense[]> {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxDays);
    await this.dentistryService.getDentistryById(dentistryId);
    return this.licenseRepo.find({
      where: {
        worker: { dentistry: { id: dentistryId } },
        expiration_date: LessThanOrEqual(maxDate),
      },
      relations: ['worker', 'worker.specialty', 'worker.dentistry'],
      order: { expiration_date: 'ASC' },
    });
  }
}
