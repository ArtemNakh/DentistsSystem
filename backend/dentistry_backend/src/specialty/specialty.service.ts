import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { Repository } from 'typeorm';
import { ISpecialty } from './entities/specialty.interface';
import { CreateSpecialtyDto } from './dto/CreateSpecialty.dto';
import { UpdateSpecialtyDto } from './dto/UpdateSpecialty.dto';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
  ) {}
  findAll(): Promise<ISpecialty[]> {
    return this.specialtyRepository.find();
  }

  async CreateSpecialty(dto: CreateSpecialtyDto): Promise<Specialty> {
    const specialty = this.specialtyRepository.create(dto);
    return this.specialtyRepository.save(specialty);
  }

  async UpdateSpecialty(
    id: number,
    dto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOne({ where: { id } });
    if (!specialty) {
      throw new NotFoundException(`Specialty with id ${id} not found`);
    }
    Object.assign(specialty, dto);
    return this.specialtyRepository.save(specialty);
  }

  async RemoveSpecialty(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const specialty = await this.specialtyRepository.findOne({
      where: { id },
      relations: ['workers'],
    });
    if (!specialty) {
      throw new NotFoundException(`Specialty with id ${id} not found`);
    }
    if (specialty.workers && specialty.workers.length > 0) {
      throw new BadRequestException(
        `Cannot delete specialty with id ${id} because it is assigned to workers`,
      );
    }
    await this.specialtyRepository.remove(specialty);
    return {
      success: true,
      message: `Specialty with id ${id} has been deleted successfully`,
    };
  }
}
