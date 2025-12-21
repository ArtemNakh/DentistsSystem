import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationList } from './entities/operation-list.entity';
import { Repository } from 'typeorm';
import { IOperationList } from './entities/operation-list.interface';


@Injectable()
export class OperationListService {
  constructor(@InjectRepository(OperationList)private operationListRepo:Repository<OperationList>){}
 

  findAll():Promise<IOperationList[]> {
    return this.operationListRepo.find();
  }

}
