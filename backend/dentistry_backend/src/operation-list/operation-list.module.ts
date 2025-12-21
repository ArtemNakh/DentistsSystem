import { Module } from '@nestjs/common';
import { OperationListService } from './operation-list.service';
import { OperationListController } from './operation-list.controller';
import { OperationList } from './entities/operation-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([OperationList])],
  controllers: [OperationListController],
  providers: [OperationListService],
})
export class OperationListModule {}
