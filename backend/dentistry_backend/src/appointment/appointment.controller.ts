import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IAppointment } from './entity/appointment.interface';
import { AppointmentDto } from './dto/gettingNearectAppointment.dto';

import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentStatusDto } from './dto/updateAppointmentStatus.dto';

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
      'Повертає список записів (appointments), починаючи з вказаної дати.',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    example: '2026-03-01',
    description: 'Дата у форматі ISO (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dentistryId',
    type: Number,
    required: true,
    example: 1,
    description: 'ID стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Список найближчих записів',
    type: AppointmentDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Некоректний формат дати або ID' })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getNearest(
    @Query('date') date: string,
    @Query('dentistryId', ParseIntPipe) dentistryId: number,
  ): Promise<IAppointment[]> {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Некоректний формат дати');
    }

    return this.appointmentService.findNearest(parsedDate, dentistryId);
  }

  @Get('today')
  @UseInterceptors(ClassSerializerInterceptor)
  async getTodayAppointments(
    @Query('dentistry') dentistryId: number,
  ): Promise<IAppointment[]> {
    return this.appointmentService.getTodayAppointmentsByDentistry(dentistryId);
  }

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointmentsDentistry(
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
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(ClassSerializerInterceptor)
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<IAppointment> {
    try {
      const newAppointment =
        await this.appointmentService.createAppointment(createAppointmentDto);
      return newAppointment;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // Ендпоінт для отримання appointment на 3 місяці
  @Get(':id/appointments/next/3month')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointments(@Param('id') id: number) {
    return this.appointmentService.findAppointmentsForWorkerToNext3Month(id);
  }

  @Get(':workerId/appointments')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointmentsByWorker(
    @Param('workerId') workerId: number,
  ): Promise<IAppointment[]> {
    console.log('workerid test', workerId);
    return this.appointmentService.findAppointmentsForWorker(workerId);
  }

  @Patch(':appointmentId/update_status')
  @ApiOperation({ summary: 'Оновлення статусу запису' })
  @ApiParam({
    name: 'appointmentId',
    description: 'ID запису, який потрібно оновити',
    type: Number,
    example: 1940,
  })
  @ApiBody({ type: UpdateAppointmentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Статус запису успішно оновлено',
    schema: {
      example: {
        message: {
          code: 'success',
          text: 'Appointment 1940 status updated to cancelled',
        },
        data: [
          {
            id: 1940,
            status: 'cancelled',
            updated_at: '2026-03-14T21:00:00.000Z',
          },
        ],
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateStatus(
    @Param('appointmentId') appointmentId: number,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentService.updateStatus(appointmentId, dto.status);
  }

  @Get('workers-stats/:dentistryId')
  @UseInterceptors(ClassSerializerInterceptor)
  async getWorkersStatsByDentistry(@Param('dentistryId') dentistryId: number) {
    return this.appointmentService.getWorkerAppointmentsStatsByDentistry(
      dentistryId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description:
      'Повертає повний запис (appointment) разом із клієнтом, стоматологом, діями (appointment_actions) та оплатою. ' +
      'Використовується для отримання детальної інформації про конкретний прийом.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    example: 1,
    description: 'Ідентифікатор запису (appointment)',
  })
  @ApiResponse({
    status: 200,
    description: 'Повний запис із усіма зв’язками',
    schema: {
      example: {
        id: 1,
        client: {
          id: 1,
          name: 'Gerry',
          surname: 'Hoppe',
          middle_name: 'Kyle',
          birthdate: '1973-02-02',
          blood_resus: 'plus',
          blood_group: 3,
          phone: '552-540-1913',
          allergic_diseases: 'dignissimos itaque sequi',
          email: 'Osvaldo_Reinger@hotmail.com',
          password: 'fp5GQiFCZq',
          isVerified: false,
          created_at: '2026-03-23T18:33:33.000Z',
          updated_at: '2026-03-23T18:33:33.000Z',
        },
        dentist: {
          id: 8,
          name: 'Cicero',
          surname: 'Weimann',
          middle_name: 'Sasha',
          birthday: '1974-11-11',
          phone: '237-649-5228',
          login: 'Kasey15',
          password: 'nXP7CU_dZn',
          created_at: '2026-03-23T18:33:33.000Z',
          updated_at: '2026-03-23T18:33:33.000Z',
          active: true,
        },
        appointment_date: '2026-03-06T16:00:00.000Z',
        notes: 'Optio expedita dolorum dolores.',
        status: 'completed',
        created_at: '2025-08-28T23:54:28.000Z',
        updated_at: '2026-03-23T20:33:37.000Z',
        appointment_actions: [
          {
            id: 1,
            operation: {
              id: 7,
              name: 'Sleek Wooden Pants',
              description: 'Andy shoes are designed...',
              price: 792,
              active: true,
              created_at: '2026-03-23T18:33:33.000Z',
              updated_at: '2026-03-23T18:33:33.000Z',
            },
            created_at: '2025-05-29T11:55:04.000Z',
            updated_at: '2026-03-23T20:33:40.000Z',
          },
        ],
        payment: {
          id: 1,
          amount: 2836,
          status_paid: 'not_paid',
          method_pay: 'cash',
          payment_date: '2025-04-02',
          created_at: '2025-10-07T03:29:34.000Z',
          updated_at: '2026-03-23T20:33:56.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Запис не знайдено' })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointment(@Param('id') id: number): Promise<IAppointment> {
    return this.appointmentService.getAppointmentById(id);
  }

  @Get('client/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointmentsByClient(@Param('id') id: number) {
    return this.appointmentService.findByClientId(id);
  }
}
