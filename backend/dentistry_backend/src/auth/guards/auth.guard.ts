// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request } from 'express';
// import { WorkersService } from 'src/workers/workers.service';

// // 🔐 AuthGuard
// // Призначення: перевіряє, чи користувач взагалі авторизований.
// // Як працює:
// // Дивиться у request.session.userId — чи є там ідентифікатор користувача.
// // Якщо немає → кидає ForbiddenException (користувач не увійшов у систему).
// // Якщо є → шукає працівника (Worker) у базі через WorkersService.findById.
// // Якщо працівника не знайдено → кидає UnauthorizedException.
// // Якщо знайдено → додає об’єкт worker у request.user, щоб його можна було використати далі в контролерах або інших guard’ах.
// // 👉 Використання: цей guard ставиться на маршрути, щоб доступ до них мали лише авторизовані користувачі.
// // @Get('profile')
// // @UseGuards(AuthGuard)
// // getProfile(@Authorized() worker: Worker) {
// //   return worker;
// // }


// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly workerService: WorkersService) {}

//   public async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: Request = context.switchToHttp().getRequest();

//     // перевірка чи є userId у сесії
//     if (typeof request.session?.userId === 'undefined') {
//       throw new ForbiddenException(
//         'Користувач не авторизований. Будь ласка, увійдіть у систему, щоб отримати доступ',
//       );
//     }

//     // шукаємо працівника за id
//     const worker = await this.workerService.findById(
//       Number(request.session.userId),
//     );

//     if (!worker) {
//       throw new UnauthorizedException(
//         'Користувач не знайдений. Переконайтеся, що ви використовуєте правильні облікові дані',
//       );
//     }

//     // додаємо працівника в request для подальшого використання
//     (request as any).user = worker;

//     return true;
//   }
// }
