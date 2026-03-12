import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAppointment } from './entity/appointment.interface';
import { AppointmentDto } from './dto/gettingNearectAppointment.dto';
import { Dentistry } from 'src/dentistry/entities/dentistry.entity';
import { CreateAppointmentDto } from './dto/createAppointment.dto';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('test/all')
  findAll() {
    return this.appointmentService.findAll();
  }

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

  @Post('add_new')
  @ApiOperation({
    summary: 'Створити новий запис',
    description:
      'Додає новий запис (appointment) для пацієнта у вказаній стоматології. ' +
      'Необхідно передати дані клієнта, лікаря, дату прийому та додаткові нотатки.',
  })
  @ApiResponse({
    status: 201,
    description: 'Запис успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані або відсутні обов’язкові параметри',
  })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<IAppointment> {
    try {
      // базова перевірка (можна винести у DTO через class-validator)
      // if (!createAppointmentDto.date || !createAppointmentDto.dentistryId) {
      //   throw new BadRequestException('Потрібно вказати дату та dentistryId');
      // }
      const newAppointment =
        await this.appointmentService.createAppointment(createAppointmentDto);
      return newAppointment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Ендпоінт для отримання appointment на 3 місяці
  @Get(':id/appointments')
  async getAppointments(@ Param('id') id: number) {
    return this.appointmentService.findAppointmentsForWorker(id);
  }
}
