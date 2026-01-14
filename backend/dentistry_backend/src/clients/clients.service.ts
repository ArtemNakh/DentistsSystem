import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
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
    const client= await this.clientRepo.findOne({
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
}
