import { Module } from '@nestjs/common';
import { DentistryService } from './dentistry.service';
import { Dentistry } from './entities/dentistry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DentistryController } from './dentistry.controller';
import { WorkersModule } from '@/workers/workers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dentistry]), WorkersModule],
  providers: [DentistryService],
  controllers: [DentistryController],
  exports: [DentistryService],
})
export class DentistryModule {}
