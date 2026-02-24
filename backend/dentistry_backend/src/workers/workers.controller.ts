import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IWorker } from './entities/workers.interface';
import { Request } from 'express';
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
    name: 'idDentistry',
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
    @Query('idDentistry') dentistryId: number,
  ): Promise<IWorker[]> {
    const workersByDentistry =
      this.workersService.GetDoctorsDentistry(dentistryId);
    return workersByDentistry;
  }

  @Get('me')
  async getCurrentWorker(@Req() req: Request) {
    console.log("Cookies:", req.cookies); console.log("Session:", req.session);
    if (!req.session.workerId) {
      throw new UnauthorizedException('No worker session');
    }
    const worker = await this.workersService.findById(
      Number(req.session.workerId),
    );
    return { ...worker };
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
