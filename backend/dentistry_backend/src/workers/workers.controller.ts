import { Controller, Get, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Worker')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get('test/all')
  findAll() {
    return this.workersService.findAll();
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
