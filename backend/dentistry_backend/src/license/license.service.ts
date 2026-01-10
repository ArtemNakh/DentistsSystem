import { Injectable } from '@nestjs/common';
import { License } from './entities/license.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILicense } from './entities/license.interface';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License) private licenseRepo: Repository<License>,
  ) {}
  findAll(): Promise<ILicense[]> {
    return this.licenseRepo.find({ relations: ['worker'] });
  }
}
