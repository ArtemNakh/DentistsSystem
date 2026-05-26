import {
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IWorker } from './entities/workers.interface';
import { Request } from 'express';
import { CreateWorkerBodyDto } from './dto/CreateWorker.dto';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { GetWorkersByDentistryQuery } from './dto/Query/GetWorkersByDentistry.query.dto';
import { WorkerResponseDto } from './dto/swagger/Worker.response.dto';
import { SearchWorkersQueryDto } from './dto/Query/SearchWorkers.query.dto';
import { WorkerIdParamDto } from './dto/Param/WorkerIdParam.param.dto';
import { plainToInstance } from 'class-transformer';
import { WorkerPublicDto } from './dto/Response/BaseType/WorkersPublic.response.dto';
import { GetPublicInfoDoctorsByDentistry } from './dto/Response/GetPublicInfoDoctorsByDentistry.response.dto';
import { GetWorkersByDentistry } from './dto/Response/GetWorkersByDentistry.response.dto';
import { GetCurrentWorkerDto } from './dto/Response/GetCurrentWorker.response.dto';
import { SearchWorkersDto } from './dto/Response/SearchWorkers.response.dto';
import { CreateWorkerResponseDto } from './dto/Response/CreateWorker.response.dto';
import { UpdateWorkerResponseDto } from './dto/Response/UpdateWorker.response.dto';
import { GetWorkerByIdResponseDto } from './dto/Response/GetWorkerById.response.dto';
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
    type: GetPublicInfoDoctorsByDentistry,
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
  async GetPublicInfoWorkersByDentistry(
    @Query() query: GetWorkersByDentistryQuery,
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
    type: GetWorkersByDentistry,
    isArray: true,
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
    @Query() query: GetWorkersByDentistryQuery,
  ): Promise<GetWorkersByDentistry[]> {
    const { dentistryId } = query;
    const workersByDentistry =
      await this.workersService.GetWorkersDentistry(dentistryId);

    return plainToInstance(GetWorkersByDentistry, workersByDentistry, {
      excludeExtraneousValues: true,
    });
  }

  @Get('me')
  @ApiOperation({
    summary: 'Отримання поточного авторизованого працівника',
    description: 'Повертає дані працівника з поточної сесії',
  })
  @ApiOkResponse({
    description: 'Поточний працівник',
    type: GetCurrentWorkerDto,
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
  async getCurrentWorker(@Req() req: Request): Promise<GetCurrentWorkerDto> {
    const worker = await this.workersService.findById(
      Number(req.session.workerId),
    );
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    return plainToInstance(GetCurrentWorkerDto, worker, {
      excludeExtraneousValues: true,
    });
  }

  @Get('search')
  @ApiOperation({
    summary: 'Пошук працівників',
    description: 'Пошук працівників за ПІБ у межах конкретної стоматології',
  })
  @ApiOkResponse({
    description: 'Список знайдених працівників',
    type: SearchWorkersDto,
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
  async searchWorkers(
    @Query() query: SearchWorkersQueryDto,
  ): Promise<SearchWorkersDto[]> {
    const { search, dentistryId } = query;
    const searchWorkers = await this.workersService.findByFullName(
      search,
      dentistryId,
    );
    return plainToInstance(SearchWorkersDto, searchWorkers, {
      excludeExtraneousValues: true,
    });
  }

  @Post('create')
  @ApiOperation({ summary: 'Створення нового працівника' })
  @ApiBody({ type: CreateWorkerBodyDto })
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
  async CreateWorker(
    @Body() dto: CreateWorkerBodyDto,
  ): Promise<CreateWorkerResponseDto> {
    const newWorker = await this.workersService.CreateWorker(dto);
    return plainToInstance(CreateWorkerResponseDto, newWorker, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновлення даних працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника', type: Number })
  @ApiBody({ type: UpdateWorkerDto })
  @ApiOkResponse({
    description: 'Працівника успішно оновлено',
    type: UpdateWorkerResponseDto,
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
  async UpdateWorker(
    @Param() params: WorkerIdParamDto,
    @Body() dto: UpdateWorkerDto,
  ): Promise<UpdateWorkerResponseDto> {
    const { id } = params;
    const updatedWorker = await this.workersService.UpdateWorker(id, dto);

    return plainToInstance(CreateWorkerResponseDto, updatedWorker, {
      excludeExtraneousValues: true,
    });
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
    type: GetWorkerByIdResponseDto,
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
  async getWorkerById(
    @Param() params: WorkerIdParamDto,
  ): Promise<GetWorkerByIdResponseDto> {
    const { id } = params;
    const findedWorker = await this.workersService.getWorkerById(id);
    return plainToInstance(GetWorkerByIdResponseDto, findedWorker, {
      excludeExtraneousValues: true,
    });
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
