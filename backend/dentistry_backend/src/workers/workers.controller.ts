import { Controller, Get, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Worker')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get('test/all')
  findAll() {
    return this.workersService.findAll();
  }

  
}
