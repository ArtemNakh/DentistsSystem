import { Module } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { Specialty } from './entities/specialty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkersModule } from '@/workers/workers.module';
import { DentistryModule } from '@/dentistry/dentistry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialty]),
    WorkersModule,
    DentistryModule,
  ],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
})
export class SpecialtyModule {}
