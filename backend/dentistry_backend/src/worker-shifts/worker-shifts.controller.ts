import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
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
import { GetShifstsByWorkerParamDto } from './dto/Params/GetShiftsByWorker.params.dto';
import { GetWorkersWeekendParamDto } from './dto/Query/getWorkersWeekend.query.dto';
import { GetWorkersWeekendQueryDto } from './dto/Params/getWorkersWeekend.param.dto';
import { GetWeekendsByWorkerParamDto } from './dto/Query/GetWeekendByWorker.query.dto';
import { GetWeekendsByWorkerQueryDto } from './dto/Params/GetWeekendsByWorker.param.dto';
import { RemoveShiftsParamDto } from './dto/Params/RemoveShifts.params.dto';
import { GetShiftsByClinicParamDto } from './dto/Params/GetShiftsByClinic.params.dto';
import { ClientOrWorker } from '@/auth/decorators/ClientOrWorker.decorator';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';

@ApiTags('Workers shifts')
@Controller('worker-shifts')
export class WorkerShiftsController {
  constructor(private readonly workerShiftsService: WorkerShiftsService) {}

  @Get('test/all')
  findAll() {
    return this.workerShiftsService.findAll();
  }

  // Ендпоінт для отримання розкладу на 3 місяці
  @Get(':workerId/shifts')
  @ApiOperation({
    summary: 'Отримати розклад змін працівника',
    description:
      'Повертає список змін (shifts), закріплених за працівником, відсортованих за датою. За замовчуванням відображаються найближчі 3 місяці.',
  })
  @ApiParam({
    name: 'workerId',
    description: 'Ідентифікатор працівника',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Список змін працівника',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 12 },
          worker: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Іван' },
              surname: { type: 'string', example: 'Петренко' },
              specialty: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 3 },
                  title: { type: 'string', example: 'Стоматолог-терапевт' },
                },
              },
            },
          },
          shift_date: {
            type: 'string',
            format: 'date',
            example: '2026-06-01',
          },
          start_time: { type: 'string', example: '09:00:00' },
          end_time: { type: 'string', example: '17:00:00' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-20T12:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-20T12:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний workerId',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'id must be a positive integer' },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Недостатньо прав',
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
    description: 'Працівник не знайдений',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 123 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ClientOrWorker()
  @UseInterceptors(ClassSerializerInterceptor)
  async getShifts(@Param() params: GetShifstsByWorkerParamDto) {
    const { workerId } = params;
    return this.workerShiftsService.findShiftsForWorker(workerId);
  }

  /**
   * GET /appointment/workers-weekend/:dentistryId?start=2026-03-01&end=2026-03-31
   * Повертає список лікарів з кількістю неробочих днів за період
   */
  @Get(':dentistryId')
  @ApiOperation({
    summary: 'Отримати кількість неробочих днів лікарів',
    description:
      'Повертає список лікарів у стоматології з кількістю неробочих днів за вказаний період. Якщо період не задано, використовується поточний місяць.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список лікарів з кількістю неробочих днів',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          worker: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Іван' },
              surname: { type: 'string', example: 'Петренко' },
              middle_name: { type: 'string', example: 'Олегович' },
              phone: { type: 'string', example: '+380671234567' },
              specialty: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 3 },
                  title: { type: 'string', example: 'Стоматолог-терапевт' },
                },
              },
            },
          },
          weekendDays: { type: 'number', example: 5 },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний формат параметрів',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'start must be a valid ISO date' },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Недостатньо прав',
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
          example: 'Dentistry with id 5 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  @UseInterceptors(ClassSerializerInterceptor)
  async getWorkersWeekend(
    @Param() params: GetWorkersWeekendParamDto,
    @Query() query: GetWorkersWeekendQueryDto,
  ) {
    const { dentistryId } = params;
    const { start, end } = query;
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
  @ApiOperation({
    summary: 'Отримати кількість неробочих днів лікаря',
    description:
      'Повертає кількість неробочих днів для конкретного лікаря за вказаний період. Якщо період не задано — використовується поточний місяць.',
  })
  @ApiParam({
    name: 'workerId',
    description: 'ID лікаря',
    type: Number,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Кількість неробочих днів лікаря',
    schema: {
      type: 'object',
      properties: {
        worker: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 5 },
            name: { type: 'string', example: 'Іван' },
            surname: { type: 'string', example: 'Петренко' },
            middle_name: { type: 'string', example: 'Олегович' },
            phone: { type: 'string', example: '+380671234567' },
            specialty: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 3 },
                title: { type: 'string', example: 'Стоматолог-терапевт' },
              },
            },
          },
        },
        weekendDays: { type: 'number', example: 7 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний формат параметрів',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'start must be a valid ISO date' },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Недостатньо прав',
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
    description: 'Лікар не знайдений',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 5 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async getWeekendByWorker(
    @Param() params: GetWeekendsByWorkerParamDto,
    @Query() query: GetWeekendsByWorkerQueryDto,
  ) {
    const { workerId } = params;
    const { start, end } = query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.workerShiftsService.getWeekendByWorker(
      workerId,
      startDate,
      endDate,
    );
  }

  @Post('create')
  @ApiOperation({
    summary: 'Додати зміну працівнику',
    description:
      'Створює нову зміну (shift) для працівника. Перед створенням перевіряється, чи існує вже така сама зміна для цього працівника (за датою та часом).',
  })
  @ApiBody({ type: CreateWorkerShiftDto })
  @ApiResponse({
    status: 201,
    description: 'Зміну успішно створено',
    type: WorkerShiftResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'shift_date must be a valid ISO date',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Працівника не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Worker not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Зміна вже існує',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example:
            'Shift for worker 91 on 2026-03-18 from 09:00:00 to 17:00:00 already exists',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  createShift(@Body() dto: CreateWorkerShiftDto): Promise<IWorkerShifts> {
    return this.workerShiftsService.createShift(dto);
  }

  @Delete(':shiftId')
  @ApiOperation({
    summary: 'Видалити зміну працівника',
    description:
      'Видаляє зміну (shift) працівника за її ідентифікатором. Якщо зміна не знайдена — повертає помилку.',
  })
  @ApiResponse({
    status: 200,
    description: 'Зміну успішно видалено',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Shift with id 1 has been deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр shiftId',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'id must be a positive integer' },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Недостатньо прав',
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
    description: 'Зміну не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Shift not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Error' },
      },
    },
  })
  @Authorization(SpecialtyType.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  removeShift(
    @Param() params: RemoveShiftsParamDto,
  ): Promise<{ success: boolean; message: string }> {
    const { shiftId } = params;
    return this.workerShiftsService.removeShift(shiftId);
  }

  @Get('clinic/:clinicId')
  @ApiOperation({
    summary: 'Отримати всі зміни працівників для стоматології',
    description:
      'Повертає список змін (shifts) для всіх працівників у стоматології за її ідентифікатором. Зміни сортуються за датою та часом початку.',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'ID стоматології',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Список змін для стоматології успішно отримано',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 101 },
          worker: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 12 },
              name: { type: 'string', example: 'Іван' },
              surname: { type: 'string', example: 'Петренко' },
              middle_name: { type: 'string', example: 'Олегович' },
              phone: { type: 'string', example: '+380671234567' },
              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Стоматологія "Здоровʼя"' },
                },
              },
              specialty: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 3 },
                  title: { type: 'string', example: 'Стоматолог-терапевт' },
                },
              },
            },
          },
          shift_date: {
            type: 'string',
            format: 'date',
            example: '2026-06-01',
          },
          start_time: { type: 'string', example: '09:00:00' },
          end_time: { type: 'string', example: '17:00:00' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-20T12:00:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-20T12:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр clinicId',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'id must be a positive integer' },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Недостатньо прав',
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
    description: 'Стоматологію не знайдено або немає змін',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Clinic with id 1 not found or no shifts available',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  async getShiftsByClinic(
    @Param() params: GetShiftsByClinicParamDto,
  ): Promise<IWorkerShifts[]> {
    const { clinicId } = params;
    return this.workerShiftsService.getShiftsByClinicId(clinicId);
  }
}
