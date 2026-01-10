import { Controller, Get } from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Workers shifts")
@Controller('worker-shifts')
export class WorkerShiftsController {
  constructor(private readonly workerShiftsService: WorkerShiftsService) {}

  
    @Get('test/all')
    findAll() {
      return this.workerShiftsService.findAll();
    }
}
