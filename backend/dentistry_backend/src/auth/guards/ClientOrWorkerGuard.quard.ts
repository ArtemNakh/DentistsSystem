import { ClientService } from "@/clients/clients.service";
import { WorkersService } from "@/workers/workers.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

// ClientOrWorkerGuard — що робить
// Перевіряє session.clientId → якщо є → авторизує клієнта
// Перевіряє session.workerId → якщо є → авторизує працівника
// Якщо нікого немає → UnauthorizedException
@Injectable()
export class ClientOrWorkerGuard implements CanActivate {
  constructor(
    private readonly clientService: ClientService,
    private readonly workerService: WorkersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();

    // --- Клієнт ---
    if (request.session?.clientId) {
      const client = await this.clientService.findById(Number(request.session.clientId));
      if (client) {
        request.user = client;
        request.userType = 'client';
        return true;
      }
    }

    // --- Працівник ---
    if (request.session?.workerId) {
      const worker = await this.workerService.findById(Number(request.session.workerId));
      if (worker) {
        request.user = worker;
        request.userType = 'worker';
        return true;
      }
    }

    throw new UnauthorizedException('Користувач не авторизований');
  }
}
