import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { License } from './entities/license.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from 'src/workers/entities/workers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([License,Worker])],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
