import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OperationListService } from './operation-list.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Operation List')
@Controller('operation-list')
export class OperationListController {
  constructor(private readonly operationListService: OperationListService) {}

  @Get("test/all")
  findAll() {
    return this.operationListService.findAll();
  }

}
