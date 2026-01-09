import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Worker} from './entities/workers.entity'

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker) private workerRepo: Repository<Worker>,
  ) {}

  findAll(): Promise<Worker[]> {
    return this.workerRepo.find({ relations: ['specialty', 'dentistry'] });
  }
}
