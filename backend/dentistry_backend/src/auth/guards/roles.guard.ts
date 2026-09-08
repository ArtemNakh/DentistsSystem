// // import {
// //   CanActivate,
// //   ExecutionContext,
// //   ForbiddenException,
// //   Injectable,
// // } from '@nestjs/common';
// // import { Reflector } from '@nestjs/core';
// // import { ROLES_KEY } from '../decorators/roles-decorator';
// // import { SpecialtyType } from 'src/specialty/entities/specialty.interface';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleConfig, ROLES_KEY } from '../decorators/roles-decorator';

// // 🛡️ RolesGuard
// // Призначення: перевіряє, чи авторизований користувач має потрібну роль (тип спеціальності).
// // Як працює:
// // Читає метадані з декоратора @Roles(...) через Reflector.
// // Якщо ролі не задані → доступ дозволено всім авторизованим.
// // Якщо ролі задані → бере worker.specialty.type і перевіряє, чи він входить у список дозволених.
// // Якщо ні → кидає ForbiddenException.
// // 👉 Використання: цей guard ставиться разом із AuthGuard, щоб перевіряти не лише авторизацію, а й права доступу.
// // @Get('admin-panel')
// // @Authorization(SpecialtyType.ADMIN)
// // getAdminPanel(@Authorized() worker: Worker) {
// //   return worker;
// // }
// // @Get('dentist-dashboard')
// // @Roles('Dentist') // дозволено лише якщо worker.specialty.name === 'Dentist'
// // @UseGuards(AuthGuard, RolesGuard)
// // getDentistDashboard(@Authorized() worker: Worker) {
// //   return `Вітаю, ${worker.name}! Це панель стоматолога.`;
// // }

// // @Get('admin-panel')
// // @Roles('Administrator') // дозволено лише якщо worker.specialty.name === 'Administrator'
// // @UseGuards(AuthGuard, RolesGuard)
// // getAdminPanel(@Authorized() worker: Worker) {
// //   return `Привіт, ${worker.name}! Це адмін-панель.`;
// // }

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleConfig = this.reflector.getAllAndOverride<RoleConfig>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const worker = request.user;

    if (!roleConfig) return true;

    // Перевірка по name
    if (roleConfig.name) {
      const names = Array.isArray(roleConfig.name)
        ? roleConfig.name
        : [roleConfig.name];
      if (names.includes(worker.specialty?.name)) {
        return true;
      }
    }

    // Перевірка по type
    if (roleConfig.type) {
      const types = Array.isArray(roleConfig.type)
        ? roleConfig.type
        : [roleConfig.type];
      if (types.includes(worker.specialty?.type)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `Недостатньо прав. Ваша професія (${worker.specialty?.name}) типу (${worker.specialty?.type}) не має доступу`,
    );
  }
}
