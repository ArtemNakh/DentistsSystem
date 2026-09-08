import { DentistryController } from '@/dentistry/dentistry.controller';
import { DentistryService } from '@/dentistry/dentistry.service';
import { Dentistry } from '@/dentistry/entities/dentistry.entity';
import { Specialty } from '@/specialty/entities/specialty.entity';
import { Worker } from '@/workers/entities/workers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupService } from './setup.service';
import { SetupController } from './setup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dentistry, Specialty, Worker])],
  providers: [SetupService],
  controllers: [SetupController],
  exports: [SetupService],
})
export class SetupModule {}
