import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
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
import { WorkerShiftResponseDto } from './dto/Response/Worker-shifts.response.dto';
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
import { GetShiftsByWorkerResponseDto } from './dto/Response/GetShiftsByWorker.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetWorkersWeekendResponseDto } from './dto/Response/GetWorkersWeekend.response.dto';
import { GetWeekendByWorkerResponseDto } from './dto/Response/GetWeekendsByWorker.response.dto';
import { CreateWorkerShiftResponseDto } from './dto/Response/CreateShift.response.dto';
import { GetShiftsByDentistryResponseDto } from './dto/Response/GetShiftsByDentistry.response.dto';

@ApiTags('Workers shifts')
@Controller('worker-shifts')
export class WorkerShiftsController {
  constructor(private readonly workerShiftsService: WorkerShiftsService) {}

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
    type: GetShiftsByWorkerResponseDto,
    isArray: true,
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
  async getShifts(
    @Param() params: GetShifstsByWorkerParamDto,
  ): Promise<GetShiftsByWorkerResponseDto[]> {
    const { workerId } = params;
    const workerShifts =
      await this.workerShiftsService.findShiftsForWorker(workerId);

    return plainToInstance(GetShiftsByWorkerResponseDto, workerShifts, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':dentistryId')
  @ApiOperation({
    summary: 'Отримати кількість неробочих днів лікарів',
    description:
      'Повертає список лікарів у стоматології з кількістю неробочих днів за вказаний період. Якщо період не задано, використовується поточний місяць.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список лікарів з кількістю неробочих днів',
    type: GetWorkersWeekendResponseDto,
    isArray: true,
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
  ): Promise<GetWorkersWeekendResponseDto[]> {
    const { dentistryId } = params;
    const { start, end } = query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dentistryShifts =
      await this.workerShiftsService.getWorkersWeekendByDentistry(
        dentistryId,
        startDate,
        endDate,
      );
    return plainToInstance(GetWorkersWeekendResponseDto, dentistryShifts, {
      excludeExtraneousValues: true,
    });
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
    type: GetWeekendByWorkerResponseDto,
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
  ): Promise<GetWeekendByWorkerResponseDto> {
    const { workerId } = params;
    const { start, end } = query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const weekendsByWorker = await this.workerShiftsService.getWeekendByWorker(
      workerId,
      startDate,
      endDate,
    );

    return plainToInstance(GetWeekendByWorkerResponseDto, weekendsByWorker, {
      excludeExtraneousValues: true,
    });
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
    type: CreateWorkerShiftResponseDto,
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
  async createShift(
    @Body() dto: CreateWorkerShiftDto,
  ): Promise<CreateWorkerShiftResponseDto> {
    const createdShift = await this.workerShiftsService.createShift(dto);

    return plainToInstance(CreateWorkerShiftResponseDto, createdShift, {
      excludeExtraneousValues: true,
    });
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
  async removeShift(
    @Param() params: RemoveShiftsParamDto,
  ): Promise<{ success: boolean; message: string }> {
    const { shiftId } = params;
    return await this.workerShiftsService.removeShift(shiftId);
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
    type: GetShiftsByDentistryResponseDto,
    isArray: true,
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
  ): Promise<GetShiftsByDentistryResponseDto[]> {
    const { clinicId } = params;
    const shifts = await this.workerShiftsService.getShiftsByClinicId(clinicId);

    return plainToInstance(GetShiftsByDentistryResponseDto, shifts, {
      excludeExtraneousValues: true,
    });
  }
}
