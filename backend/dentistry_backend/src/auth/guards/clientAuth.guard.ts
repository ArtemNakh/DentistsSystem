import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientService } from '@/clients/clients.service';

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

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private readonly clientService: ClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.session?.clientId) {
      throw new ForbiddenException('Клієнт не авторизований');
    }

    const client = await this.clientService.findById(Number(request.session.clientId));
    if (!client) {
      throw new UnauthorizedException('Клієнта не знайдено');
    }

    (request as any).user = client;
    return true;
  }
}
