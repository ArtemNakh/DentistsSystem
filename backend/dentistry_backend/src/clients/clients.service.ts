import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ILike, Repository } from 'typeorm';
import { IClient } from './entities/client.interface';
import { CreateClientInput } from './dto/CreateClientInput.dto';
import * as argon2 from 'argon2';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  findAll(): Promise<IClient[]> {
    return this.clientRepo.find();
  }

  //new
  public async findByEmail(email: string): Promise<Client | null> {
    const client = await this.clientRepo.findOne({
      where: { email },
    });
    return client;
  }

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
}
