// import { Injectable } from '@nestjs/common';
// import { CreateDentistryDto } from './dto/create-dentistry.dto';
// import { UpdateDentistryDto } from './dto/update-dentistry.dto';
// import { InjectModel } from '@nestjs/sequelize';
// import { Dentistry } from './entities/dentistry.entity';

import { Inject, Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Dentistry } from './entities/dentistry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IDentistry } from './entities/dentistry.interface';

// @Injectable()
// export class DentistryService {
//   constructor(
//     @InjectModel(Dentistry) private dentistryRepo: typeof Dentistry,
//   ) {}

//   // create(createDentistryDto: CreateDentistryDto) {
//   //   return 'This action adds a new dentistry';
//   // }
//   testGetAll() {
//     return this.dentistryRepo.findAll();
//   }
//   // findAll() {
//   //   return `This action returns all dentistry`;
//   // }

//   // findOne(id: number) {
//   //   return `This action returns a #${id} dentistry`;
//   // }

//   // update(id: number, updateDentistryDto: UpdateDentistryDto) {
//   //   return `This action updates a #${id} dentistry`;
//   // }

//   // remove(id: number) {
//   //   return `This action removes a #${id} dentistry`;
//   // }
// }

@Injectable()
export class DentistryService {
  constructor(
    @InjectRepository(Dentistry)
    private dentistryRepository: Repository<Dentistry>,
  ) {}

  async findAll(): Promise<IDentistry[]> {
    return this.dentistryRepository.find();
  }

  async findByCity(city: string): Promise<Dentistry[]> {
    return this.dentistryRepository.find({
      where: {
        city: ILike(`%${city}%`), // нечутливий до регістру пошук
      }, // якщо треба підтягнути працівників
    });
  }
}
