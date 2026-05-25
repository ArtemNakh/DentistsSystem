import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IWorker } from './entities/workers.interface';
import { Request } from 'express';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';
import { CreateWorkerResponseDto } from './dto/swagger/CreateWorker.response.dto';
import { WorkerUpdateResponseDto } from './dto/swagger/UpdateWorker.response.dto';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { GetWorkersByDentistry } from './dto/Query/GetWorkersByDentistry.query.dto';
import { WorkerResponseDto } from './dto/swagger/Worker.response.dto';
import { SearchWorkersQueryDto } from './dto/Query/SearchWorkers.query.dto';
import { SearchWorkerResponseDto } from './dto/swagger/SearchWorker.response.dto';
import { WorkerIdParamDto } from './dto/Param/WorkerIdParam.param.dto';
import { plainToInstance } from 'class-transformer';
import { WorkerPublicDto } from './dto/Response/WorkersPublic.response.dto';
@ApiTags('Worker')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get('all-info')
  @ApiOperation({
    summary:
      'Отримання інформації про усіх працівників стоматології та їхні ліцензії',
    description:
      'Використовується для отримання усіх працівників у певній стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Список лікарів стоматології',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 9 },
          name: { type: 'string', example: 'Monte' },
          surname: { type: 'string', example: 'Leuschke' },
          middle_name: { type: 'string', example: 'Gray' },
          birthday: { type: 'string', format: 'date', example: '1973-05-23' },
          phone: { type: 'string', example: '2631546799' },
          specialty: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 11 },
              name: { type: 'string', example: 'Orthodontist' },
              description: {
                type: 'string',
                example:
                  'Specialist in diagnosing, preventing, and correcting misaligned teeth and jaws using braces, aligners, and other orthodontic treatments.',
              },
              type: { type: 'string', example: 'doctor' },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-02-21T17:08:02.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-02-21T17:08:02.000Z',
              },
            },
          },
          login: { type: 'string', example: 'Collin.Rodriguez25' },
          password: { type: 'string', example: '7UZbXJfMOX' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-21T17:08:02.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-21T17:08:02.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр dentistryId',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId must be a positive number'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ заборонено',
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
  @UseInterceptors(ClassSerializerInterceptor)
  async GetInfoWorkersByDentistry(
    @Query() query: GetWorkersByDentistry,
  ): Promise<WorkerPublicDto[]> {
    const { dentistryId } = query;
    const workersByDentistry =
      await this.workersService.GetInfoWorkersByDentistry(dentistryId);
   
    return plainToInstance(WorkerPublicDto, workersByDentistry, {
      excludeExtraneousValues: true,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Отримання усіх працівників стоматології',
    description:
      'Використовується для отримання усіх працівників у певній стоматології',
  })
  @ApiResponse({
    status: 200,
    description: 'Список лікарів стоматології',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 9 },
          name: { type: 'string', example: 'Monte' },
          surname: { type: 'string', example: 'Leuschke' },
          middle_name: { type: 'string', example: 'Gray' },
          birthday: { type: 'string', format: 'date', example: '1973-05-23' },
          phone: { type: 'string', example: '2631546799' },
          specialty: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 11 },
              name: { type: 'string', example: 'Orthodontist' },
              description: {
                type: 'string',
                example:
                  'Specialist in diagnosing, preventing, and correcting misaligned teeth and jaws using braces, aligners, and other orthodontic treatments.',
              },
              type: { type: 'string', example: 'doctor' },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-02-21T17:08:02.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-02-21T17:08:02.000Z',
              },
            },
          },
          login: { type: 'string', example: 'Collin.Rodriguez25' },
          password: { type: 'string', example: '7UZbXJfMOX' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-21T17:08:02.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-21T17:08:02.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр dentistryId',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId must be a positive number'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ заборонено',
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async GetWorkersByDentistry(
    @Query() query: GetWorkersByDentistry,
  ): Promise<IWorker[]> {
    const { dentistryId } = query;
    const workersByDentistry =
      this.workersService.GetWorkersDentistry(dentistryId);
    return workersByDentistry;
  }

  @Get('me')
  @ApiOperation({
    summary: 'Отримання поточного авторизованого працівника',
    description: 'Повертає дані працівника з поточної сесії',
  })
  @ApiOkResponse({
    description: 'Поточний працівник',
    type: WorkerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getCurrentWorker(@Req() req: Request) {
    const worker = await this.workersService.findById(
      Number(req.session.workerId),
    );
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const { password, ...safeWorker } = worker;
    return safeWorker as WorkerResponseDto;
  }

  @Get('search')
  @ApiOperation({
    summary: 'Пошук працівників',
    description: 'Пошук працівників за ПІБ у межах конкретної стоматології',
  })
  @ApiOkResponse({
    description: 'Список знайдених працівників',
    type: SearchWorkerResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні параметри пошуку',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['dentistryId must be a positive number'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ заборонено',
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async searchWorkers(@Query() query: SearchWorkersQueryDto) {
    const { search, dentistryId } = query;
    return this.workersService.findByFullName(search, dentistryId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Створення нового працівника' })
  @ApiBody({ type: CreateWorkerDto })
  @ApiResponse({
    status: 201,
    description: 'Працівника успішно створено',
    type: CreateWorkerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для створення',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId must be a number conforming to the specified constraints',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав для створення працівника',
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
    status: 409,
    description: 'Логін чи пароль вже існує',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Логін чи пароль вже існує' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  CreateWorker(@Body() dto: CreateWorkerDto): Promise<IWorker> {
    return this.workersService.CreateWorker(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновлення даних працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника', type: Number })
  @ApiBody({ type: UpdateWorkerDto })
  @ApiOkResponse({
    description: 'Працівника успішно оновлено',
    type: WorkerUpdateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для оновлення',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['phone must be a valid string'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав для оновлення працівника',
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
    description: 'Працівника не знайдено',
    schema: {
      example: {
        statusCode: 404,
        message: 'Worker not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Логін чи пароль вже існує',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Логін чи пароль вже існує' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  UpdateWorker(
    @Param() params: WorkerIdParamDto,
    @Body() dto: UpdateWorkerDto,
  ): Promise<IWorker> {
    const { id } = params;
    return this.workersService.UpdateWorker(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Деактивувати працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника', type: Number })
  @ApiOkResponse({ description: 'Працівника успішно деактивовано' })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр id',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['id must be a positive integer'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав для деактивації працівника',
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
    description: 'Працівника не знайдено',
    schema: {
      example: {
        statusCode: 404,
        message: 'Worker not found',
        error: 'Not Found',
      },
    },
  })
  @Authorization(SpecialtyType.ADMIN)
  RemoveWorker(@Param() params: WorkerIdParamDto): Promise<void> {
    const { id } = params;
    return this.workersService.RemoveWorker(id);
  }

  @Get('by-id/:id')
  @ApiOperation({ summary: 'Отримати працівника за ID' })
  @ApiOkResponse({
    description: 'Працівника знайдено',
    type: WorkerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний параметр id',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['id must be a positive number'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав для перегляду працівника',
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
    description: 'Працівника не знайдено',
    schema: {
      example: {
        statusCode: 404,
        message: 'Працівника з id=69 не знайден',
        error: 'Not Found',
      },
    },
  })
  @Authorization(
    SpecialtyType.ADMIN,
    SpecialtyType.DOCTOR,
    SpecialtyType.RECEPTION,
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async getWorkerById(@Param() params: WorkerIdParamDto): Promise<IWorker> {
    const { id } = params;
    return this.workersService.getWorkerById(id);
  }

  // way to used auth decorators
  // allow only client auth
  // @UseGuards(ClientAuthGuard)
  // allow only worker auth (any type)
  //  @Authorization()
  // allow only worker auth for type
  // @Authorization(SpecialtyType.ADMIN)
  // allow client and worker(any type) auth
  //  @ClientOrWorker()
  // allow client and worker (by type) auth
  // @ClientOrWorker(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)\

  // Check Client and Worker  auth
  // @ClientOrWorker(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  // async getPaymentsByDentistry(
  //   @Query() query: GetPaymentsByDentistryDto,
  // ): Promise<Payment[]> {
  //   const { dentistryId } = query;
  //   return this.paymentService.getPaymentsByDentistry(dentistryId);
  // }
  //   // Check autorization
  // // доступ для всіх авторизованих працівників
  // @Get('worker/profile') @Authorization() getWorkerProfile(
  //   @Authorized() worker: Worker,
  // ) {
  //   return worker;
  // }
  // // доступ лише для ADMIN працівників
  // @Get('worker/admin-panel') @Authorization(SpecialtyType.ADMIN) getAdminPanel(
  //   @Authorized() worker: Worker,
  // ) {
  //   return `Привіт, ${worker.name}! Це адмін-панель.`;
  // }
  // // доступ лише для клієнтів
  // @Get('client/profile') @UseGuards(ClientAuthGuard) getClientProfile(
  //   @Authorized() client: Client,
  // ) {
  //   return client;
  // }
  // // доступ лише для стоматологів (по назві спеціалізації)
  // @Get('worker/dentist-dashboard')
  // @Roles('doctor1')
  // @UseGuards(WorkerAuthGuard, RolesGuard)
  // getDentistDashboard(@Authorized() worker: Worker) {
  //   return `Вітаю, ${worker.name}! Це панель стоматолога.`;
  // }

  // // Тільки по назві
  // @Get('doctor-panel')
  // @Roles({ name: 'doctor1' })
  // @UseGuards(WorkerAuthGuard, RolesGuard)
  // getDoctorPanel(@Authorized() worker: Worker) {
  //   return `Панель для ${worker.specialty?.name}`;
  // }

  // // Тільки по типу
  // @Get('dentist-panel')
  // @Roles({ type: 'doctor' })
  // @UseGuards(WorkerAuthGuard, RolesGuard)
  // getDentistPanel(@Authorized() worker: Worker) {
  //   return `Панель для типу ${worker.specialty?.type}`;
  // }

  // // Обидва варіанти (або one, або інші)
  // @Get('admin-panel')
  // @Roles({ name: ['admin1', 'admin2'], type: 'admin' })
  // @UseGuards(WorkerAuthGuard, RolesGuard)
  // get1AdminPanel(@Authorized() worker: Worker) {
  //   return `Адмін-панель`;
  // }

  // // Просто строка (як раніше)
  // @Get('simple')
  // @Roles('doctor1')
  // @UseGuards(WorkerAuthGuard, RolesGuard)
  // getSimple(@Authorized() worker: Worker) {
  //   return worker;
  // }
}
