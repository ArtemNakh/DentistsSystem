import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Dentistry } from './entities/dentistry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IDentistry } from './entities/dentistry.interface';
import { CreateDentistryDto } from './dto/create-dentistry.dto';
import { UpdateDentistryDto } from './dto/update-dentistry.dto';
import { UpdateDentistryStatusDto } from './dto/update-dentistry-status.dto';

@Injectable()
export class DentistryService {
  constructor(
    @InjectRepository(Dentistry)
    private dentistryRepository: Repository<Dentistry>,
  ) {}

  async create(dto: CreateDentistryDto): Promise<IDentistry> {
    // Перевірка на логічну коректність (захист від некоректного JSON або пустих значень)
    if (!dto.street?.trim() || !dto.city?.trim() || !dto.region?.trim()) {
      throw new BadRequestException(
        'Поля street, city та region є обов’язковими і не можуть бути порожніми',
      );
    }

    //  Перевірка на дублікати (вулиця + місто + регіон)
    const exists = await this.dentistryRepository.findOne({
      where: {
        street: dto.street,
        city: dto.city,
        region: dto.region,
      },
    });

    if (exists) {
      throw new BadRequestException(
        `Стоматологія за адресою ${dto.street}, ${dto.city}, ${dto.region} вже існує`,
      );
    }

    const clinic = this.dentistryRepository.create(dto);
    return this.dentistryRepository.save(clinic);
  }

  async update(id: number, dto: UpdateDentistryDto): Promise<Dentistry> {
    // 1️⃣ Перевірка — чи існує клініка
    const clinic = await this.dentistryRepository.findOne({ where: { id } });

    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${id} not found`);
    }

    // 2️⃣ Перевірка — DTO не порожній
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Update payload cannot be empty');
    }

    // 3️⃣ Перевірка — поля не пусті (захист від "", "   ")
    if (dto.street !== undefined && !dto.street.trim()) {
      throw new BadRequestException('Street cannot be empty');
    }
    if (dto.city !== undefined && !dto.city.trim()) {
      throw new BadRequestException('City cannot be empty');
    }
    if (dto.region !== undefined && !dto.region.trim()) {
      throw new BadRequestException('Region cannot be empty');
    }

    // 4️⃣ Перевірка — чи не створюється дублікат адреси
    if (dto.street || dto.city || dto.region) {
      const duplicate = await this.dentistryRepository.findOne({
        where: {
          street: dto.street ?? clinic.street,
          city: dto.city ?? clinic.city,
          region: dto.region ?? clinic.region,
        },
      });

      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(
          `Clinic at ${dto.street ?? clinic.street}, ${dto.city ?? clinic.city}, ${
            dto.region ?? clinic.region
          } already exists`,
        );
      }
    }

    Object.assign(clinic, dto);

    return this.dentistryRepository.save(clinic);
  }

  async updateStatus(id: number, dto: UpdateDentistryStatusDto): Promise<void> {
    //  Перевірка — чи існує клініка
    const clinic = await this.dentistryRepository.findOne({ where: { id } });

    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${id} not found`);
    }

    // Перевірка — DTO не порожній
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Status payload cannot be empty');
    }

    // Перевірка — чи не передано зайві поля
    const allowedKeys = ['isActive'];
    const invalidKeys = Object.keys(dto).filter(
      (k) => !allowedKeys.includes(k),
    );

    if (invalidKeys.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidKeys.join(', ')}`,
      );
    }

    // Перевірка — чи isActive передано
    if (dto.isActive === undefined || dto.isActive === null) {
      throw new BadRequestException('isActive field is required');
    }

    // Перевірка — чи isActive є boolean
    if (typeof dto.isActive !== 'boolean') {
      throw new BadRequestException('isActive must be a boolean value');
    }

    // Перевірка — чи статус не такий самий
    if (clinic.is_active === dto.isActive) {
      throw new BadRequestException(
        `Clinic already has status isActive = ${dto.isActive}`,
      );
    }

    //  Оновлення статусу
    clinic.is_active = dto.isActive;

    await this.dentistryRepository.save(clinic);
  }

  async findAll(): Promise<IDentistry[]> {
    return this.dentistryRepository.find();
  }

  async findByCity(city: string): Promise<Dentistry[]> {
    //  Перевірка — чи передано параметр
    if (city === undefined || city === null) {
      throw new BadRequestException('City parameter is required');
    }

    // Перевірка — чи це рядок
    if (typeof city !== 'string') {
      throw new BadRequestException('City must be a string');
    }

    // Перевірка — чи не порожній рядок
    const normalized = city.trim();

    if (!normalized) {
      throw new BadRequestException('City cannot be an empty string');
    }

    // 4️Перевірка — мінімальна довжина (захист від шумових запитів)
    if (normalized.length < 2) {
      throw new BadRequestException('City must contain at least 2 characters');
    }

    // Пошук
    return this.dentistryRepository.find({
      where: {
        city: ILike(`%${normalized}%`),
      },
    });
  }
}
