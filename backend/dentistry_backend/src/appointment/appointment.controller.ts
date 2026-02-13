import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAppointment } from './entity/appointment.interface';
import { AppointmentDto } from './dto/gettingNearectAppointment.dto';

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
  async getNearest(@Query('date') date: string): Promise<IAppointment[]> {
    const parsedDate = new Date(date);
    return this.appointmentService.findNearest(parsedDate);
  }
}
