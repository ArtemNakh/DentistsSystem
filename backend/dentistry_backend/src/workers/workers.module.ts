import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/workers.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Dentistry } from 'src/dentistry/entities/dentistry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Worker, Specialty, Dentistry])],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
