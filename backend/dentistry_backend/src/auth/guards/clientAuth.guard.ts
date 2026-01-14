import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientService } from 'src/clients/clients.service';


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
