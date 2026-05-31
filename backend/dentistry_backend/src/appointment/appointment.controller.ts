import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentStatusDto } from './dto/updateAppointmentStatus.dto';
import { GetNearestDto } from './dto/Query/GetNearest.query.dto';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { GetTodaytDto } from './dto/Query/GetToday.query.dto';
import { GetAppointmentsDentistryDto } from './dto/Query/GetAppointmentsDentistry.query.dto';
import { GetHistoryDentistryDto } from './dto/Query/GetHistoryDentistry.query.dto';
import { GetWorkerAppointmentsDto } from './dto/Params/GetAppointmentsToNext3Month.param.dto';
import { UpdateAppointmentStatusParamDto } from './dto/Params/UpdateAppointmentStatus.param.dto';
import { WorkersStatsByDentistry } from './dto/Params/GetWorkersStatsByDentistry.param.dto';
import { GetClientsAppointmentParamDto } from './dto/Params/GetClientsAppointment.param.dto';
import { ClientOrWorker } from '@/auth/decorators/ClientOrWorker.decorator';
import { GetAppointmentsByClientParams } from './dto/Params/GetAppointmentsByClient.param.dto';
import { GetNearestAppointmentsResponseDto } from './dto/Response/GetNearestAppointments.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetTodayAppointmentsResponseDto } from './dto/Response/GetTodayAppointments.response.dto';
import { GetAllAppointmentsResponseDto } from './dto/Response/GetAllAppointments.response.dto';
import { GetHistoryAppointmentsResponseDto } from './dto/Response/GetHistoryAppointments.response.dto';
import { CreateAppointmentResponseDto } from './dto/Response/CreateAppointment.response.dto';
import { GetAppointmentsNext3MonthResponseDto } from './dto/Response/GetAppointmentsNext3Month.response.dto';
import { GetAppointmentsByWorkerResponseDto } from './dto/Response/GetAppointmentsByWorker.response.dto';
import { UpdateStatusAppointmentResponseDto } from './dto/Response/UpdateStatusAppointment.response.dto';
import { GetWorkersStatsResponseDto } from './dto/Response/GetWorkersStats.response.dto';
import { GetAppointmentResponseDto } from './dto/Response/GetAppointment.response.dto';
import { GetAppointmentsByClientResponseDto } from './dto/Response/GetAppointmentsByClient.response.dto';
import { GetAppointmentsByClientQuery } from './dto/Query/GetAppointmentsByClient.query.dto';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('nearest')
  @ApiOperation({
    summary: 'Отримати найближчі записи',
    description:
      'Повертає список записів (appointments), починаючи з вказаної дати.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список найближчих записів',
    type: GetNearestAppointmentsResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Некоректний формат дати або ID' })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(
    SpecialtyType.ADMIN,
    SpecialtyType.RECEPTION,
    SpecialtyType.DOCTOR,
  )
  async getNearest(
    @Query() query: GetNearestDto,
  ): Promise<GetNearestAppointmentsResponseDto[]> {
    const { dentistryId, date } = query;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Некоректний формат дати');
    }

    const nearestAppointments = await this.appointmentService.findNearest(
      parsedDate,
      dentistryId,
    );

    return plainToInstance(
      GetNearestAppointmentsResponseDto,
      nearestAppointments,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Get('today')
  @ApiOperation({
    summary: 'Отримати записи на сьогодні',
    description:
      'Повертає список записів (appointments), у яких дата вказана сьогодні',
  })
  @ApiResponse({
    status: 200,
    description: 'Список сьогоднішніх записів',
    type: GetTodayAppointmentsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getTodayAppointments(
    @Query() query: GetTodaytDto,
  ): Promise<GetTodayAppointmentsResponseDto[]> {
    const { dentistryId } = query;
    const todayAppointment =
      await this.appointmentService.getTodayAppointmentsByDentistry(
        dentistryId,
      );

    return plainToInstance(GetTodayAppointmentsResponseDto, todayAppointment, {
      excludeExtraneousValues: true,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Отримання усіх записів для стоматології',
    description:
      'Повертає список записів (appointments), для певної стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Список сьогоднішніх записів',
    type: GetAllAppointmentsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async getAppointmentsDentistry(
    @Query() query: GetAppointmentsDentistryDto,
  ): Promise<GetAllAppointmentsResponseDto[]> {
    const { dentistryId } = query;
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException(
        'Query parameter "dentistry" must be a valid number',
      );
    }
    const allAppointment =
      await this.appointmentService.getAppointmentsByDentistry(dentistryId);

    return plainToInstance(GetAllAppointmentsResponseDto, allAppointment, {
      excludeExtraneousValues: true,
    });
  }

  @Get('history')
  @ApiOperation({
    summary: 'Отрмиання історії записів для певної стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Історія записів отримана успішно',
    type: GetHistoryAppointmentsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async getHistoryByDentistry(
    @Query() query: GetHistoryDentistryDto,
  ): Promise<GetHistoryAppointmentsResponseDto[]> {
    const { dentistryId, take, skip } = query;
    if (!dentistryId || isNaN(dentistryId)) {
      throw new BadRequestException(
        'Query parameter "dentistry" must be a valid number',
      );
    }

    const historyAppointemnt =
      await this.appointmentService.getHistoryByDentistry(
        dentistryId,
        take,
        skip,
      );
    console.log('his', historyAppointemnt);
    return plainToInstance(
      GetHistoryAppointmentsResponseDto,
      historyAppointemnt,
      {
        excludeExtraneousValues: true,
      },
    );
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
    type: CreateAppointmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Внутрішня помилка сервера' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ClientOrWorker()
  // @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<CreateAppointmentResponseDto> {
    try {
      const newAppointment =
        await this.appointmentService.createAppointment(createAppointmentDto);
      return plainToInstance(CreateAppointmentResponseDto, newAppointment, {
        excludeExtraneousValues: true,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':workerId/appointments/next/3month')
  @ApiOperation({
    summary: 'Отрмиання майбутніх записів',
    description:
      'Отримання записів (appointment) на наступні 3 місяці для стоматології. ',
  })
  @ApiResponse({
    status: 200,
    description: 'Записи для працівника на наступні 3 місяці отримано успішно',
    type: GetAppointmentsNext3MonthResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointmentsForWorkerNext3Month(
    @Param() params: GetWorkerAppointmentsDto,
  ): Promise<GetAppointmentsNext3MonthResponseDto[]> {
    const { workerId } = params;
    const appointments =
      await this.appointmentService.findAppointmentsForWorkerToNext3Month(
        workerId,
      );

    return plainToInstance(GetAppointmentsNext3MonthResponseDto, appointments, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':workerId/appointments')
  @ApiOperation({
    summary: 'Отрмиання записів працівника',
    description: 'Отримання записів (appointment) по працівнику. ',
  })
  @ApiResponse({
    status: 200,
    description: 'Записи для працівника отримано успішно',
    type: GetAppointmentsByWorkerResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId має бути більше 0'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Працівника не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getAppointmentsByWorker(
    @Param() params: GetWorkerAppointmentsDto,
  ): Promise<GetAppointmentsByWorkerResponseDto[]> {
    const { workerId } = params;
    const appointments =
      await this.appointmentService.findAppointmentsForWorker(workerId);

    return plainToInstance(GetAppointmentsByWorkerResponseDto, appointments, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':appointmentId/update_status')
  @ApiOperation({ summary: 'Оновлення статусу запису' })
  @ApiBody({ type: UpdateAppointmentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Статус запису успішно оновлено',
    type: UpdateStatusAppointmentResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async updateStatus(
    @Param() params: UpdateAppointmentStatusParamDto,
    @Body() dto: UpdateAppointmentStatusDto,
  ): Promise<UpdateStatusAppointmentResponseDto> {
    const { appointmentId } = params;
    const updatedappointments = await this.appointmentService.updateStatus(
      appointmentId,
      dto.status,
    );

    return plainToInstance(
      UpdateStatusAppointmentResponseDto,
      updatedappointments,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Get('workers-stats/:dentistryId')
  @ApiOperation({
    summary: 'Отримання статистики для стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика працівників стоматології отримана успішно',
    type: GetWorkersStatsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getWorkersStatsByDentistry(
    @Param() params: WorkersStatsByDentistry,
  ): Promise<GetWorkersStatsResponseDto[]> {
    const { dentistryId } = params;
    const appointmentsStats =
      await this.appointmentService.getWorkerAppointmentsStatsByDentistry(
        dentistryId,
      );
    return plainToInstance(GetWorkersStatsResponseDto, appointmentsStats, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':appointmentId')
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description:
      'Повертає повний запис (appointment) разом із клієнтом, стоматологом, діями (appointment_actions) та оплатою. ' +
      'Використовується для отримання детальної інформації про конкретний прийом.',
  })
  @ApiResponse({
    status: 200,
    description: 'Повний запис із усіма зв’язками',
    type: GetAppointmentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ClientOrWorker()
  async getAppointment(
    @Param() params: GetClientsAppointmentParamDto,
  ): Promise<GetAppointmentResponseDto> {
    const { appointmentId } = params;
    const appointment =
      await this.appointmentService.getAppointmentById(appointmentId);

    return plainToInstance(GetAppointmentResponseDto, appointment, {
      excludeExtraneousValues: true,
    });
  }

  @Get('client/:clientId')
  @ApiOperation({
    summary: 'Отримання всіх записів клієнта',
    description:
      'Повертає список усіх записів (appointments) для конкретного клієнта за його ідентифікатором. Включає інформацію про клієнта, стоматолога, дії та оплату.',
  })
  @ApiResponse({
    status: 200,
    description: 'Записи отримано успішно',
    type: GetAppointmentsByClientResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований користувач',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  // @UseGuards(ClientAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAppointmentsByClient(
    @Param() params: GetAppointmentsByClientParams,
    @Query() query: GetAppointmentsByClientQuery,
  ): Promise<GetAppointmentsByClientResponseDto[]> {
    const { clientId } = params;
    const { take, skip } = query;
    const appointments = await this.appointmentService.findByClientId(
      clientId,
      take,
      skip,
    );

    return plainToInstance(GetAppointmentsByClientResponseDto, appointments, {
      excludeExtraneousValues: true,
    });
  }
}
