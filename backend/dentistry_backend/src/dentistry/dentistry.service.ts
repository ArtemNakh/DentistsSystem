import { Injectable } from '@nestjs/common';
import { CreateDentistryDto } from './dto/create-dentistry.dto';
import { UpdateDentistryDto } from './dto/update-dentistry.dto';

@Injectable()
export class DentistryService {
  create(createDentistryDto: CreateDentistryDto) {
    return 'This action adds a new dentistry';
  }

  findAll() {
    return `This action returns all dentistry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dentistry`;
  }

  update(id: number, updateDentistryDto: UpdateDentistryDto) {
    return `This action updates a #${id} dentistry`;
  }

  remove(id: number) {
    return `This action removes a #${id} dentistry`;
  }
}
