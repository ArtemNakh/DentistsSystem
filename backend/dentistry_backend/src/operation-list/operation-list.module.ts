import { Module } from '@nestjs/common';
import { OperationListService } from './operation-list.service';
import { OperationListController } from './operation-list.controller';
import { OperationList } from './entities/operation-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dentistry } from '@/dentistry/entities/dentistry.entity';
import { Worker } from '@/workers/entities/workers.entity';
import { WorkersModule } from '@/workers/workers.module';
@Module({
  imports:[WorkersModule,TypeOrmModule.forFeature([OperationList,Dentistry,Worker])],
  controllers: [OperationListController],
  providers: [OperationListService],
})
export class OperationListModule {}
