import { Controller, Get, Param } from '@nestjs/common';
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



  // Ендпоінт для отримання розкладу на 3 місяці
  @Get(':id/shifts')
  async getShifts(@Param('id') id: number) {
    return this.workerShiftsService.findShiftsForWorker(id);
  }
}
