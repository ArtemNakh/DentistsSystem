import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from './entities/workers.entity';
import { IWorker } from './entities/workers.interface';
import { SpecialtyType } from 'src/specialty/entities/specialty.interface';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker) private workerRepo: Repository<Worker>,
  ) {}

  //test
  findAll(): Promise<Worker[]> {
    return this.workerRepo.find({ relations: ['specialty', 'dentistry'] });
  }

  public async findById(id: number): Promise<IWorker> {
    const worker = await this.workerRepo.findOne({
      where: { id },
      relations: [
        'specialty',
        'dentistry',
        'licenses',
        'appointments',
        'shifts',
      ],
    });

    if (!worker) {
      throw new NotFoundException(
        'Працівника не знайдено. Будь ласка, перевірте введені дані',
      );
    }
    return worker;
  }

  public async findByLogin(login: string): Promise<Worker> {
    const worker = await this.workerRepo.findOne({
      where: { login },
      relations: [
        'specialty',
        'dentistry',
        'licenses',
        'appointments',
        'shifts',
      ],
    });

    if (!worker) {
      throw new NotFoundException(`Worker with login "${login}" not found`);
    }

    return worker;
  }

  public async GetDoctorsDentistry(dentistryId: number) {
   
    const doctors= this.workerRepo.find({
      where: {
        dentistry: { id: dentistryId },
        specialty: { type: SpecialtyType.DOCTOR },
      },
      relations:['specialty','dentistry']
    });

return doctors;
  }
}
