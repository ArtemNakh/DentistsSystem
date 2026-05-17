import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WorkerShiftsService } from './worker-shifts.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IWorkerShifts } from './entities/worker-shifts.interface';
import { CreateWorkerShiftDto } from './dto/CreateWorker-shift.dto';
import { WorkerShiftResponseDto } from './dto/response/Worker-shifts.response.dto';
import { WorkerShifts } from './entities/worker-shifts.entity';

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
  @Get(':dentistryId')
  async getWorkersWeekend(
    @Param('dentistryId') dentistryId: number,
    @Query('start') start: string,
    @Query('end') end: string,
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
  @Get('worker/:workerId')
  async getWeekendByWorker(
    @Param('workerId') workerId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.workerShiftsService.getWeekendByWorker(
      workerId,
      startDate,
      endDate,
    );
  }

  @Post('create')
  @ApiOperation({ summary: 'Додати зміну працівнику' })
  @ApiBody({ type: CreateWorkerShiftDto })
  @ApiResponse({
    status: 201,
    description: 'Зміну успішно створено',
    type: WorkerShiftResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  createShift(@Body() dto: CreateWorkerShiftDto): Promise<IWorkerShifts> {
    return this.workerShiftsService.createShift(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити зміну працівника' })
  @ApiParam({ name: 'id', description: 'ID зміни', type: Number })
  @ApiResponse({ status: 200, description: 'Зміну успішно видалено' })
  @ApiResponse({ status: 404, description: 'Зміну не знайдено' })
  removeShift(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.workerShiftsService.removeShift(id);
  }

  @Get('clinic/:clinicId')
  @ApiOperation({ summary: 'Отримати всі зміни працівників для стоматології' })
  @ApiParam({ name: 'clinicId', description: 'ID стоматології', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Список змін для стоматології успішно отримано',
    type: WorkerShifts,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологію не знайдено або немає змін',
  })
  async getShiftsByClinic(
    @Param('clinicId', ParseIntPipe) clinicId: number,
  ): Promise<IWorkerShifts[]> {
    
    return this.workerShiftsService.getShiftsByClinicId(clinicId);
  }
}
