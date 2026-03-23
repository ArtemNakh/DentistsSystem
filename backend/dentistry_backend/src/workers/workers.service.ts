import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Worker } from './entities/workers.entity';
import { IWorker } from './entities/workers.interface';
import { SpecialtyType } from 'src/specialty/entities/specialty.interface';
import * as argon2 from 'argon2';
import { RegisterWorkerDto } from './dto/registerWorker.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Dentistry } from 'src/dentistry/entities/dentistry.entity';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker) private workerRepo: Repository<Worker>,
    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,
    @InjectRepository(Dentistry)
    private readonly dentistryRepo: Repository<Dentistry>,
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
    const doctors = this.workerRepo.find({
      where: {
        dentistry: { id: dentistryId },
        specialty: { type: SpecialtyType.DOCTOR },
      },
      relations: ['specialty', 'dentistry'],
    });

    return doctors;
  }

  async CreateWorker(dto: CreateWorkerDto): Promise<IWorker> {
    const specialty = await this.specialtyRepo.findOne({
      where: { id: dto.specialtyId },
    });
    const dentistry = await this.dentistryRepo.findOne({
      where: { id: dto.dentistryId },
    });

    const worker = this.workerRepo.create({
      ...dto,
      specialty,
      dentistry,

      birthday: new Date(dto.birthday),
    } as Partial<IWorker>); // <-- підказуємо TS, що це Partial<Worker>

    return this.workerRepo.save(worker);
  }

  async UpdateWorker(id: number, dto: UpdateWorkerDto): Promise<Worker> {
    const worker = await this.workerRepo.findOne({ where: { id } });
    if (!worker) {
      throw new Error(`Worker with id ${id} not found`);
    }

    const specialty = await this.specialtyRepo.findOneBy({
      id: dto.specialtyId,
    });
    const dentistry = await this.dentistryRepo.findOneBy({
      id: dto.dentistryId,
    });

    Object.assign(worker, { ...dto, specialty, dentistry });
    return this.workerRepo.save(worker);
  }

  async RemoveWorker(idWorker: number): Promise<void> {
    const worker = await this.workerRepo.findOne({ where: { id: idWorker } });
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    worker.active = false;
    await this.workerRepo.save(worker);
  }

  //temporary
  // ➕ Створення нового працівника
  public async createWorkerTemporary(dto: RegisterWorkerDto): Promise<Worker> {
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
     birthday: new Date(dto.birthday).toISOString().split('T')[0],
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

  async findByFullName(search: string, idDentistry: number): Promise<Worker[]> {
    if (!search) {
      return this.workerRepo.find({
        where: { dentistry: { id: idDentistry } },
        relations: ['specialty'],
      });
    }

    const parts = search.trim().split(/\s+/);

    // Масив умов OR для кожного слова і кожного поля
    const where: any[] = [];

    parts.forEach((part) => {
      const like = Like(`%${part}%`);
      where.push(
        { dentistry: { id: idDentistry }, surname: like },
        { dentistry: { id: idDentistry }, name: like },
        { dentistry: { id: idDentistry }, middle_name: like },
      );
    });

    return this.workerRepo.find({
      where,
      relations: ['specialty', 'dentistry'],
    });
  }
}
