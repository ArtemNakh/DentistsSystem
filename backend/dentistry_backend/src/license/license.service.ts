import { Injectable, NotFoundException } from '@nestjs/common';
import { License } from './entities/license.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILicense } from './entities/license.interface';
import { CreateLicenseDto } from './dto/CreateLicense.dto';
import { Worker } from 'src/workers/entities/workers.entity';
import { UpdateLicenseDto } from './dto/UpdateLicense.dto';
@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License) private licenseRepo: Repository<License>,
    @InjectRepository(Worker) private readonly workerRepo: Repository<Worker>,
  ) {}
  findAll(): Promise<ILicense[]> {
    return this.licenseRepo.find({ relations: ['worker'] });
  }

  async createLicense(dto: CreateLicenseDto): Promise<License> {
    const worker = await this.workerRepo.findOne({
      where: { id: dto.workerId },
    });
    if (!worker) throw new NotFoundException('Worker not found');

    const license = this.licenseRepo.create({ ...dto, worker });
    return this.licenseRepo.save(license);
  }

  async updateLicense(id: number, dto: UpdateLicenseDto): Promise<License> {
    const license = await this.licenseRepo.findOne({
      where: { id },
      relations: ['worker'],
    });
    if (!license) throw new NotFoundException('License not found');

    Object.assign(license, dto);
    return this.licenseRepo.save(license);
  }

  async removeLicense(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const license = await this.licenseRepo.findOne({ where: { id } });
    if (!license) throw new NotFoundException('License not found');

    await this.licenseRepo.remove(license);
    return {
      success: true,
      message: `License with id ${id} has been deleted successfully`,
    };
  }


  async getLicensesByDentistry(dentistryId: number): Promise<ILicense[]> {
    return this.licenseRepo.find({
      relations: ['worker', 'worker.dentistry','worker.specialty'],
      where: {
        worker: {
          dentistry: { id: dentistryId },
        },
      },
    });
  }
}
