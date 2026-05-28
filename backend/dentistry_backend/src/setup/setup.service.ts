import { Dentistry } from '@/dentistry/entities/dentistry.entity';
import { Specialty } from '@/specialty/entities/specialty.entity';
import { Worker } from '@/workers/entities/workers.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
/**
 * SetupService відповідає за створення та видалення
 * дефолтних сутностей у базі даних:
 * - стоматологічної клініки
 * - спеціальності
 * - працівника
 *
 * Використовується для початкової ініціалізації системи.
 */
@Injectable()
export class SetupService {
  constructor(
    @InjectRepository(Dentistry)
    private readonly dentistryRepo: Repository<Dentistry>,

    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,

    @InjectRepository(Worker)
    private readonly workerRepo: Repository<Worker>,
  ) {}

  /**
   * Створює дефолтні сутності, якщо вони ще не існують:
   * - клініку з містом DEFAULTCITY
   * - спеціальність з назвою DEFAULTNAME
   * - працівника з ім’ям DEFAULTNAME
   *
   * Викликається при першому запуску системи.
   */
  async CreateDefaultUser(): Promise<void> {
    // Перевірка чи існує клініка
    let existDefaultDentistry = await this.dentistryRepo.findOne({
      where: { city: 'DEFAULTCITY' },
    });

    if (!existDefaultDentistry) {
      existDefaultDentistry = this.dentistryRepo.create({
        city: 'DEFAULTCITY',
        street: 'DEFAULTSTREET',
        region: 'DEFAULTREGION',
      });
      await this.dentistryRepo.save(existDefaultDentistry);
    }

    // Перевірка чи існує спеціальність
    let existDefaultSpecialty = await this.specialtyRepo.findOne({
      where: { name: 'DEFAULTNAME' },
    });

    if (!existDefaultSpecialty) {
      existDefaultSpecialty = this.specialtyRepo.create({
        name: 'DEFAULTNAME',
        type: SpecialtyType.ADMIN,
      });
      await this.specialtyRepo.save(existDefaultSpecialty);
    }

    // Перевірка чи існує працівник
    const existDefaultWorker = await this.workerRepo.findOne({
      where: { name: 'DEFAULTNAME' },
    });

    if (!existDefaultWorker) {
      const hashedPassword = await argon2.hash('default_password');
      const newWorker = this.workerRepo.create({
        name: 'DEFAULTNAME',
        surname: 'DEFAULTSURNAME',
        middle_name: 'DEFAULTMIDDLE',
        birthday: new Date('1990-01-01'),
        phone: '+380000000000',
        login: 'default_login',
        password: hashedPassword,
        dentistry: existDefaultDentistry,
        specialty: existDefaultSpecialty,
        active: true,
      });
      await this.workerRepo.save(newWorker);
    }
  }

  /**
   * Видаляє дефолтні сутності, якщо вони існують:
   * - працівника з ім’ям DEFAULTNAME
   * - спеціальність з назвою DEFAULTNAME
   * - клініку з містом DEFAULTCITY
   *
   * Використовується для очищення тестових даних.
   */
  async RemoveDefaultUser(): Promise<void> {
    // Видалення спеціальності
    const existDefaultSpecialty = await this.specialtyRepo.findOne({
      where: { name: 'DEFAULTNAME' },
    });

    if (existDefaultSpecialty) {
      await this.specialtyRepo.remove(existDefaultSpecialty);
    }

    // Видалення працівника
    const existDefaultWorker = await this.workerRepo.findOne({
      where: { name: 'DEFAULTNAME' },
      relations: ['dentistry', 'specialty'],
    });

    if (existDefaultWorker) {
      await this.workerRepo.remove(existDefaultWorker);
    }

    // Видалення клініки
    const existDefaultDentistry = await this.dentistryRepo.findOne({
      where: { city: 'DEFAULTCITY' },
    });

    if (existDefaultDentistry) {
      await this.dentistryRepo.remove(existDefaultDentistry);
    }
  }
}
