import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  ApiBody,
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
import { WorkerResponseDto } from './dto/Response/CreateWorker.response.dto';
import { ErrorResponseDto } from './dto/Response/ErrorWorker.response.dto';
import { WorkerUpdateResponseDto } from './dto/Response/UpdateWorker.response.dto';
@ApiTags('Worker')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get('test/all')
  findAll() {
    return this.workersService.findAll();
  }

  @Get('all/doctors')
  @ApiOperation({
    summary: 'Отримання усіх докторів стоматології',
    description:
      'Використовувати для отримання усіх працівників(докторів) у певній стоматології',
  })
  @ApiQuery({
    name: 'dentistry',
    type: Number,
    required: true,
    description: 'Ідентифікатор стоматології',
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
          phone: { type: 'string', example: '263-154-6799' },
          specialty: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 11 },
              name: { type: 'string', example: 'Dynamic Factors Strategist' },
              description: {
                type: 'string',
                example:
                  'Rem pariatur reiciendis nostrum qui totam eaque repellat autem nulla.',
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
  async GetDoctorsByDentistry(
    @Query('dentistry') dentistryId: number,
  ): Promise<IWorker[]> {
    const workersByDentistry =
      this.workersService.GetDoctorsDentistry(dentistryId);
    return workersByDentistry;
  }

  @Get('me')
  async getCurrentWorker(@Req() req: Request) {
    if (!req.session.workerId) {
      throw new UnauthorizedException('No worker session');
    }
    const worker = await this.workersService.findById(
      Number(req.session.workerId),
    );
    return { ...worker };
  }

  @Get('search')
  async searchWorkers(@Query('search') search: string, @Req() req: Request) {
    const worker = await this.workersService.findById(
      Number(req.session.workerId),
    );

    return this.workersService.findByFullName(search, worker.dentistry.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Створити нового працівника' })
  @ApiBody({ type: CreateWorkerDto })
  @ApiResponse({
    status: 201,
    description: 'Працівника успішно створено',
    type: WorkerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для створення',
    type: ErrorResponseDto,
  })
  CreateWorker(@Body() dto: CreateWorkerDto): Promise<IWorker> {
    return this.workersService.CreateWorker(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити дані працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника', type: Number })
  @ApiBody({ type: UpdateWorkerDto })
  @ApiResponse({
    status: 200,
    description: 'Працівника успішно оновлено',
    type: WorkerUpdateResponseDto,
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
  UpdateWorker(
    @Param('id') id: number,
    @Body() dto: UpdateWorkerDto,
  ): Promise<IWorker> {
    return this.workersService.UpdateWorker(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Деактивувати працівника (active = false)' })
  @ApiParam({ name: 'id', description: 'ID працівника', type: Number })
  @ApiResponse({ status: 200, description: 'Працівника успішно деактивовано' })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  RemoveWorker(@Param('id') id: number): Promise<void> {
    return this.workersService.RemoveWorker(id);
  }

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
