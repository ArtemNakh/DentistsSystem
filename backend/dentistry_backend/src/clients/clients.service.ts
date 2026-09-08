import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ILike, Repository } from 'typeorm';
import { IClient } from './entities/client.interface';
import { CreateClientInput } from './dto/CreateClientInput.dto';
import * as argon2 from 'argon2';
import { UpdateClientDto } from './dto/UpdateClient.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  /**
   * Отримати список усіх клієнтів.
   * @returns Масив клієнтів у форматі IClient[]
   */
  findAll(): Promise<IClient[]> {
    return this.clientRepo.find();
  }

  /**
   * Знайти клієнта за email.
   * @param email - електронна пошта клієнта
   * @returns Клієнт або null, якщо не знайдено
   */
  public async findByEmail(email: string): Promise<Client | null> {
    const client = await this.clientRepo.findOne({
      where: { email },
    });
    return client;
  }

  /**
   * Створити нового клієнта.
   * Пароль хешується за допомогою argon2.
   * @param data - DTO з даними для створення клієнта
   * @returns Створений клієнт
   */
  public async createClient(data: CreateClientInput): Promise<Client> {
    const client = await this.clientRepo.create({
      name: data.name,
      surname: data.surname,
      middle_name: data.middle_name,
      birthdate: data.birthdate,
      blood_resus: data.blood_resus,
      blood_group: data.blood_group,
      phone: data.phone,
      allergic_diseases: data.allergic_diseases,
      email: data.email,
      password: await argon2.hash(data.password),
    });
    await this.clientRepo.save(client);
    return client;
  }

  /**
   * Знайти клієнта за його ID.
   * Якщо клієнта не знайдено — кидає NotFoundException.
   * @param id - унікальний ідентифікатор клієнта
   * @returns Клієнт з усіма зв’язаними прийомами
   */
  public async findById(id: number): Promise<IClient> {
    const client = await this.clientRepo.findOne({
      where: { id },
      relations: ['appointments'],
    });

    if (!client) {
      throw new NotFoundException(
        'Працівника не знайдено. Будь ласка, перевірте введені дані',
      );
    }
    return client;
  }

  /**
   * Пошук клієнтів за повним ім’ям.
   * Пошук виконується по прізвищу, імені, по батькові та комбінації.
   * @param search - рядок пошуку (може містити кілька слів)
   * @returns Масив клієнтів, що відповідають критеріям
   */
  async findByFullName(search: string): Promise<Client[]> {
    if (!search) {
      return this.clientRepo.find();
    }

    const parts = search.trim().split(/\s+/);

    let qb = this.clientRepo.createQueryBuilder('client');

    // Для кожного слова додаємо умову AND:
    parts.forEach((part, index) => {
      const param = `part${index}`;
      qb = qb.andWhere(
        `(LOWER(client.surname) LIKE LOWER(:${param}) 
        OR LOWER(client.name) LIKE LOWER(:${param}) 
        OR LOWER(client.middle_name) LIKE LOWER(:${param}) 
        OR LOWER(CONCAT(client.surname, ' ', client.name, ' ', IFNULL(client.middle_name, ''))) LIKE LOWER(:${param}))`,
        { [param]: `%${part}%` },
      );
    });

    return qb.getMany();
  }

  /**
   * Оновити дані клієнта за його ID.
   * Якщо клієнта не знайдено — кидає NotFoundException.
   * @param clientId - унікальний ідентифікатор клієнта
   * @param dto - DTO з новими даними для оновлення
   * @returns Оновлений клієнт
   */
  async update(clientId: number, dto: UpdateClientDto): Promise<Client> {
    
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    Object.assign(client, dto);
    return await this.clientRepo.save(client);
  }
}
