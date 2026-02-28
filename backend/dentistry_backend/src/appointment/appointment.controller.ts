import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAppointment } from './entity/appointment.interface';
import { AppointmentDto } from './dto/gettingNearectAppointment.dto';
import { Dentistry } from 'src/dentistry/entities/dentistry.entity';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('test/all')
  findAll() {
    return this.appointmentService.findAll();
  }

  // GET /appointments/nearest?date=2026-03-01

  @Get('nearest')
  @ApiOperation({
    summary: 'Отримати найближчі записи',
    description:
      'Повертає список записів (appointments), починаючи з вказаної дати. ' +
      'Можна використовувати для пошуку найближчих операцій чи консультацій.',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    example: '2026-03-01',
    description: 'Дата у форматі ISO (YYYY-MM-DD), з якої починається пошук',
  })
  @ApiResponse({
    status: 200,
    description: 'Список найближчих записів',
    type: AppointmentDto, // якщо у тебе є DTO/клас, краще використати його
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Некоректний формат дати' })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  async getNearest(
    @Query('date') date: string,
    @Query('dentistryId') dentistryId: number,
  ): Promise<IAppointment[]> {
    const parsedDate = new Date(date);
    return this.appointmentService.findNearest(parsedDate, dentistryId);
  }

  @Get('today') async getTodayAppointments(
    @Query('dentistry') dentistryId: number,
  ): Promise<IAppointment[]> {
    return this.appointmentService.getTodayAppointmentsByDentistry(dentistryId);
  }

  @Get('all') async getAppointmentsDentistry(
    @Query('dentistry') dentistryId: number,
  ): Promise<IAppointment[]> {
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException(
        'Query parameter "dentistry" must be a valid number',
      );
    }
    return this.appointmentService.getAppointmentsByDentistry(dentistryId);
  }

  @Get('history')
  async getHistoryByDentistry(
    @Query('dentistry') dentistryId: number,
  ): Promise<IAppointment[]> {
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException(
        'Query parameter "dentistry" must be a valid number',
      );
    }

    return this.appointmentService.getHistoryByDentistry(dentistryId);
  }
}
