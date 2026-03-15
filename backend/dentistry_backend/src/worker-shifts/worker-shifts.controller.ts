import { Controller, Get, Param, Query } from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import { ApiTags } from '@nestjs/swagger';
import { IWorkerShifts } from './entities/worker-shifts.interface';
import { IWorker } from 'src/workers/entities/workers.interface';

@ApiTags('Workers shifts')
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



  /**
   * GET /appointment/workers-weekend/:dentistryId?start=2026-03-01&end=2026-03-31
   * Повертає список лікарів з кількістю неробочих днів за період
   */
  @Get(":dentistryId")
  async getWorkersWeekend(
    @Param("dentistryId") dentistryId: number,
    @Query("start") start: string,
    @Query("end") end: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.workerShiftsService.getWorkersWeekendByDentistry(
      dentistryId,
      startDate,
      endDate,
    );
  }

  /**
   * GET /appointment/workers-weekend/worker/:workerId?start=2026-03-01&end=2026-03-31
   * Повертає кількість неробочих днів для конкретного лікаря за період
   */
  @Get("worker/:workerId")
  async getWeekendByWorker(
    @Param("workerId") workerId: number,
    @Query("start") start: string,
    @Query("end") end: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.workerShiftsService.getWeekendByWorker(workerId, startDate, endDate);
  }
}
