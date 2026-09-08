import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { License } from './entities/license.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from '@/workers/entities/workers.entity';
import { WorkersModule } from '@/workers/workers.module';
import { DentistryModule } from '@/dentistry/dentistry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([License, Worker]),
    WorkersModule,
    DentistryModule,
  ],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
