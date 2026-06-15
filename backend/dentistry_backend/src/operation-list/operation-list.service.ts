import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationList } from './entities/operation-list.entity';
import { Repository } from 'typeorm';
import { IOperationList } from './entities/operation-list.interface';
import { CreateOperationDto } from './dto/CreateOperation-list.dto';
import { Dentistry } from '../dentistry/entities/dentistry.entity';
import { DentistryService } from '@/dentistry/dentistry.service';
import { UpdateOperationDto } from './dto/Update-Operation-list.dto';

@Injectable()
export class OperationListService {
  constructor(
    @InjectRepository(OperationList)
    private operationListRepo: Repository<OperationList>,
    @InjectRepository(Dentistry)
    private readonly dentistryRepo: Repository<Dentistry>,

    private readonly dentistryService: DentistryService,
  ) {}

  /**
   * Отримати список усіх операцій.
   * @returns Масив операцій у форматі IOperationList[]
   */
  findAll(): Promise<IOperationList[]> {
    return this.operationListRepo.find();
  }

  /**
   * Створити нову операцію для конкретної стоматології.
   * Виконує перевірку на існування дубліката за назвою.
   * @param dto - DTO з даними для створення операції
   * @param dentistryId - ID стоматології
   * @throws NotFoundException якщо стоматологію не знайдено
   * @throws ConflictException якщо операція з такою назвою вже існує
   * @returns Створена операція
   */
  async createOperation(
    dto: CreateOperationDto,
    dentistryId: number,
  ): Promise<OperationList> {
    const dentistry = await this.dentistryRepo.findOne({
      where: { id: dentistryId },
    });
    if (!dentistry) throw new NotFoundException('Dentistry not found');

    // Перевірка: чи існує операція з такою ж назвою у цій стоматології
    const existingOperation = await this.operationListRepo.findOne({
      where: {
        name: dto.name,
        dental_clinic: { id: dentistryId },
      },
      relations: ['dental_clinic'],
    });

    if (existingOperation) {
      throw new ConflictException(
        `Operation with name "${dto.name}" already exists in this dentistry`,
      );
    }

    const operation = this.operationListRepo.create({
      ...dto,
      dental_clinic: dentistry,
    });
    return this.operationListRepo.save(operation);
  }

  /**
   * Оновити дані існуючої операції.
   * @param operationId - ID операції
   * @param dto - DTO з новими даними
   * @throws NotFoundException якщо операцію не знайдено
   * @returns Оновлена операція
   */
  async updateOperation(
    operationId: number,
    dto: UpdateOperationDto,
  ): Promise<OperationList> {
    const operation = await this.operationListRepo.findOne({
      where: { id: operationId },
      relations: ['dental_clinic'],
    });
    if (!operation) throw new NotFoundException('Operation not found');

    Object.assign(operation, dto);
    return this.operationListRepo.save(operation);
  }

  /**
   * Деактивувати операцію (soft delete).
   * Змінює прапорець active на false.
   * @param id - ID операції
   * @throws NotFoundException якщо операцію не знайдено
   * @returns Об’єкт з success=true та повідомленням
   */
  async removeOperation(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const operation = await this.operationListRepo.findOne({ where: { id } });
    if (!operation) throw new NotFoundException('Operation not found');

    operation.active = false; // <-- робимо неактивним
    await this.operationListRepo.save(operation);

    return {
      success: true,
      message: `Operation with id ${id} has been deactivated`,
    };
  }

  /**
   * Пошук операцій за назвою та стоматологією.
   * Виконує фільтрацію по частинах рядка та ID стоматології.
   * @param search - рядок пошуку (може бути порожнім)
   * @param dentistryId - ID стоматології
   * @throws NotFoundException якщо стоматологію не знайдено
   * @returns Масив операцій, що відповідають критеріям
   */
  async findByName(
    search: string,
    dentistryId: number,
    active?: boolean,
  ): Promise<IOperationList[]> {
    await this.dentistryService.getDentistryById(dentistryId);

    let qb = this.operationListRepo
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.dental_clinic', 'dental_clinic');

    // фільтр по назві
    if (search) {
      const parts = search.trim().split(/\s+/);
      parts.forEach((part, index) => {
        const param = `part${index}`;
        qb = qb.andWhere(`LOWER(operation.name) LIKE LOWER(:${param})`, {
          [param]: `%${part}%`,
        });
      });
    }

    // фільтр по dentistryId
    if (dentistryId) {
      qb = qb.andWhere('dental_clinic.id = :dentistryId', { dentistryId });
    }
    // фільтр по active
    if (typeof active !== 'undefined') {
      qb = qb.andWhere('operation.active = :active', { active });
    }
    return qb.getMany();
  }

  async findAllByDentistry(
    dentistryId: number,
    take?: number,
    skip?: number,
    active?: boolean,
  ): Promise<IOperationList[]> {
    if (!dentistryId) {
      throw new BadRequestException('dentistryId має бути вказаний і більше 0');
    }

    const existingDentistry =
      await this.dentistryService.getDentistryById(dentistryId);

    if (!existingDentistry) {
      throw new NotFoundException(
        `Стоматологія з id ${dentistryId} не знайдена`,
      );
    }
    // базова умова
    const whereCondition: any = { dental_clinic: { id: existingDentistry.id } };

    // якщо передано active=true/false — додаємо фільтр
    if (typeof active !== 'undefined') {
      whereCondition.active = true;
    }
    const operations = await this.operationListRepo.find({
      where: whereCondition,
      relations: ['dental_clinic'],
      order: { created_at: 'DESC' },
      take: take,
      skip: skip,
    });

    if (!operations || operations.length === 0) {
      throw new NotFoundException(
        `Для стоматології з id ${dentistryId} не знайдено жодної операції`,
      );
    }
    return operations;
  }
}
