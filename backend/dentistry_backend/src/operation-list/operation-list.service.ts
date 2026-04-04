import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationList } from './entities/operation-list.entity';
import { Repository } from 'typeorm';
import { IOperationList } from './entities/operation-list.interface';
import {
  CreateOperationDto,
  UpdateOperationDto,
} from './dto/CreateOperation-list.dto';
import { Dentistry } from '../dentistry/entities/dentistry.entity';

@Injectable()
export class OperationListService {
  constructor(
    @InjectRepository(OperationList)
    private operationListRepo: Repository<OperationList>,
    @InjectRepository(Dentistry)
    private readonly dentistryRepo: Repository<Dentistry>,
  ) {}

  findAll(): Promise<IOperationList[]> {
    return this.operationListRepo.find();
  }

  async createOperation(
    dto: CreateOperationDto,
    dentistryId: number,
  ): Promise<OperationList> {
    const dentistry = await this.dentistryRepo.findOne({
      where: { id: dentistryId },
    });
    if (!dentistry) throw new NotFoundException('Dentistry not found');

    const operation = this.operationListRepo.create({
      ...dto,
      dental_clinic: dentistry,
    });
    return this.operationListRepo.save(operation);
  }

  async updateOperation(
    id: number,
    dto: UpdateOperationDto,
  ): Promise<OperationList> {
    const operation = await this.operationListRepo.findOne({
      where: { id },
      relations: ['dental_clinic'],
    });
    if (!operation) throw new NotFoundException('Operation not found');

    Object.assign(operation, dto);
    return this.operationListRepo.save(operation);
  }

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

  async findByName(
    search: string,
    dentistryId?: number,
  ): Promise<IOperationList[]> {
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

    return qb.getMany();
  }
}
