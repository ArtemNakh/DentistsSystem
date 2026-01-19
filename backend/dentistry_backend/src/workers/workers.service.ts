import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from './entities/workers.entity';
import { IWorker } from './entities/workers.interface';
import * as argon2 from 'argon2';
import { RegisterWorkerDto } from 'src/auth/dto/registerWorker.dto';

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

  //temporary
  // ➕ Створення нового працівника
  public async createWorker(dto: RegisterWorkerDto): Promise<Worker> {
    // перевірка чи логін вже існує
    const exists = await this.workerRepo.findOne({
      where: { login: dto.login },
    });
    if (exists) {
      throw new ConflictException('Працівник з таким логіном вже існує');
    }
    // хешування пароля
    const hashedPassword = await argon2.hash(dto.password);
    const worker = this.workerRepo.create({
      name: dto.name,
      surname: dto.surname,
      middle_name: dto.middle_name,
      birthday: dto.birthday,
      phone: dto.phone,
      login: dto.login,
      password: hashedPassword,
      specialty: { id: dto.specialtyId },
      dentistry: { id: dto.dentistryId },
    });
    return await this.workerRepo.save(worker);
  }

  public async findByLoginTemp(login: string): Promise<Worker | null> {
    const worker = await this.workerRepo.findOne({ where: { login } });
    return worker ?? null; // повертає null, якщо не знайдено
  }
}
