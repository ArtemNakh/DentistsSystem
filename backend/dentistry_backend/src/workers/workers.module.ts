import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/workers.entity';
import { Specialty } from '@/specialty/entities/specialty.entity';
import { Dentistry } from '@/dentistry/entities/dentistry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Worker, Specialty, Dentistry])],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
