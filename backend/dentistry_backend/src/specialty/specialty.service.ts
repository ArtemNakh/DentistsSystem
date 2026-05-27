import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { Like, Repository } from 'typeorm';
import { ISpecialty, SpecialtyType } from './entities/specialty.interface';
import { CreateSpecialtyDto } from './dto/CreateSpecialty.dto';
import { UpdateSpecialtyDto } from './dto/UpdateSpecialty.dto';
import { DentistryService } from '@/dentistry/dentistry.service';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,

    private readonly dentistryService: DentistryService,
  ) {}

  /**
   * Отримати список усіх спеціалізацій.
   * @returns Масив спеціалізацій у форматі ISpecialty[]
   */
  findAll(): Promise<ISpecialty[]> {
    return this.specialtyRepository.find();
  }

  /**
   * Створити нову спеціалізацію.
   * Виконує перевірки на коректність даних та дублювання.
   * @param dto - DTO з даними для створення спеціалізації
   * @throws BadRequestException якщо дані некоректні або порожні
   * @throws ConflictException якщо спеціалізація з такою назвою вже існує
   * @returns Створена спеціалізація
   */
  async CreateSpecialty(dto: CreateSpecialtyDto): Promise<Specialty> {
    // Перевірка — DTO не порожній
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Payload cannot be empty');
    }

    //  Перевірка — name існує і не порожній
    if (dto.name === undefined || dto.name === null) {
      throw new BadRequestException('Field "name" is required');
    }

    if (typeof dto.name !== 'string' || !dto.name.trim()) {
      throw new BadRequestException('Field "name" must be a non-empty string');
    }

    // Перевірка — description (якщо передано)
    if (dto.description !== undefined) {
      if (typeof dto.description !== 'string') {
        throw new BadRequestException('Field "description" must be a string');
      }
      if (!dto.description.trim()) {
        throw new BadRequestException('Field "description" cannot be empty');
      }
    }

    // Перевірка — type існує і валідний
    if (dto.type === undefined || dto.type === null) {
      throw new BadRequestException('Field "type" is required');
    }

    if (!Object.values(SpecialtyType).includes(dto.type)) {
      throw new BadRequestException(
        `Field "type" must be one of: ${Object.values(SpecialtyType).join(', ')}`,
      );
    }

    // Перевірка — спеціалізація з такою назвою вже існує
    const exists = await this.specialtyRepository.findOne({
      where: { name: dto.name.trim(), type: dto.type },
    });

    if (exists) {
      throw new ConflictException(
        `Specialty with name "${dto.name}" already exists`,
      );
    }

    // Створення
    const specialty = this.specialtyRepository.create({
      ...dto,
      name: dto.name.trim(),
      description: dto.description?.trim(),
    });

    return this.specialtyRepository.save(specialty);
  }

  /**
   * Оновити існуючу спеціалізацію.
   * Виконує перевірки на коректність даних, дублювання та наявність змін.
   * @param specialtyId - ID спеціалізації
   * @param dto - DTO з новими даними
   * @throws NotFoundException якщо спеціалізацію не знайдено
   * @throws BadRequestException якщо дані некоректні або змін немає
   * @throws ConflictException якщо дублюється name + type
   * @returns Оновлена спеціалізація
   */
  async UpdateSpecialty(
    specialtyId: number,
    dto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    //  Перевірка — чи існує спеціалізація
    const specialty = await this.specialtyRepository.findOne({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new NotFoundException(`Specialty with id ${specialtyId} not found`);
    }

    //  Перевірка — DTO не порожній
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Update payload cannot be empty');
    }

    // Перевірка — name (якщо передано)
    if (dto.name !== undefined) {
      if (typeof dto.name !== 'string') {
        throw new BadRequestException('Field "name" must be a string');
      }
      if (!dto.name.trim()) {
        throw new BadRequestException('Field "name" cannot be empty');
      }
    }

    //  Перевірка — description (якщо передано)
    if (dto.description !== undefined) {
      if (typeof dto.description !== 'string') {
        throw new BadRequestException('Field "description" must be a string');
      }
      if (!dto.description.trim()) {
        throw new BadRequestException('Field "description" cannot be empty');
      }
    }

    //  Перевірка — type (якщо передано)
    if (dto.type !== undefined) {
      if (!Object.values(SpecialtyType).includes(dto.type)) {
        throw new BadRequestException(
          `Field "type" must be one of: ${Object.values(SpecialtyType).join(', ')}`,
        );
      }
    }

    // Перевірка — чи не дублюється name + type
    if (dto.name || dto.type) {
      const exists = await this.specialtyRepository.findOne({
        where: {
          name: dto.name?.trim() ?? specialty.name,
          type: dto.type ?? specialty.type,
        },
      });

      if (exists && exists.id !== specialtyId) {
        throw new ConflictException(
          `Specialty with name "${dto.name ?? specialty.name}" and type "${
            dto.type ?? specialty.type
          }" already exists`,
        );
      }
    }

    //  Перевірка — чи є хоч якісь зміни
    const updatedName = dto.name?.trim() ?? specialty.name;
    const updatedDesc = dto.description?.trim() ?? specialty.description;
    const updatedType = dto.type ?? specialty.type;

    if (
      updatedName === specialty.name &&
      updatedDesc === specialty.description &&
      updatedType === specialty.type
    ) {
      throw new BadRequestException('No changes detected');
    }

    //  Оновлення
    Object.assign(specialty, {
      name: updatedName,
      description: updatedDesc,
      type: updatedType,
    });

    return this.specialtyRepository.save(specialty);
  }

  /**
   * Видалити спеціалізацію.
   * Перевіряє, чи спеціалізація існує та чи не використовується працівниками.
   * @param specialtyId - ID спеціалізації
   * @throws BadRequestException якщо ID некоректний або спеціалізація використовується
   * @throws NotFoundException якщо спеціалізацію не знайдено
   * @returns Об’єкт з success=true та повідомленням
   */
  async RemoveSpecialty(
    specialtyId: number,
  ): Promise<{ success: boolean; message: string }> {
    // Перевірка — id передано
    if (specialtyId === undefined || specialtyId === null) {
      throw new BadRequestException('Specialty ID is required');
    }

    // Перевірка — id є числом
    if (typeof specialtyId !== 'number' || Number.isNaN(specialtyId)) {
      throw new BadRequestException('Specialty ID must be a valid number');
    }

    //  Перевірка — чи існує спеціалізація
    const specialty = await this.specialtyRepository.findOne({
      where: { id: specialtyId },
      relations: ['workers'],
    });

    if (!specialty) {
      throw new NotFoundException(`Specialty with id ${specialtyId} not found`);
    }

    //  Перевірка — чи спеціалізація використовується працівниками
    if (Array.isArray(specialty.workers) && specialty.workers.length > 0) {
      throw new BadRequestException(
        `Cannot delete specialty with id ${specialtyId} because it is assigned to ${specialty.workers.length} worker(s)`,
      );
    }

    //  Видалення
    await this.specialtyRepository.remove(specialty);

    return {
      success: true,
      message: `Specialty with id ${specialtyId} has been deleted successfully`,
    };
  }

  /**
   * Знайти спеціалізації за назвою та стоматологією.
   * Виконує пошук по назві (мінімум 2 символи) та ID стоматології.
   * @param idDentistry - ID стоматології
   * @param search - рядок пошуку (необов’язковий)
   * @throws BadRequestException якщо параметри некоректні
   * @throws NotFoundException якщо стоматологію не знайдено
   * @returns Масив спеціалізацій, що відповідають критеріям
   */
  async findByFullName(
    idDentistry: number,
    search?: string,
  ): Promise<ISpecialty[]> {
    // Перевірка — idDentistry передано
    if (idDentistry === undefined || idDentistry === null) {
      throw new BadRequestException('Dentistry ID is required');
    }

    //  Перевірка — idDentistry є числом
    if (typeof idDentistry !== 'number' || Number.isNaN(idDentistry)) {
      throw new BadRequestException('Dentistry ID must be a valid number');
    }

    const dentistryExists =
      await this.dentistryService.getDentistryById(idDentistry);

    if (!dentistryExists) {
      throw new NotFoundException(`Dentistry with id ${idDentistry} not found`);
    }
    //  Якщо search не передано → повертаємо всі спеціальності по стоматології
    if (search === undefined || search === null || search.trim() === '') {
      return this.specialtyRepository.find({
        where: { workers: { dentistry: { id: idDentistry } } },
        relations: ['workers', 'workers.dentistry'],
      });
    }

    //  Перевірка — search має бути string
    if (typeof search !== 'string') {
      throw new BadRequestException('Search parameter must be a string');
    }

    const normalized = search.trim();

    //  Перевірка — search не може бути порожнім після trim
    if (!normalized) {
      throw new BadRequestException('Search parameter cannot be empty');
    }

    //  Перевірка — мінімальна довжина пошуку
    if (normalized.length < 2) {
      throw new BadRequestException(
        'Search parameter must contain at least 2 characters',
      );
    }

    //  Пошук
    return this.specialtyRepository.find({
      where: {
        workers: { dentistry: { id: idDentistry } },
        name: Like(`%${normalized}%`),
      },
      relations: ['workers', 'workers.dentistry'],
    });
  }
}
