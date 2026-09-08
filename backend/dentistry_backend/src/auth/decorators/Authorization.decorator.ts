import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';

import { RoleConfig, Roles } from './roles-decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { WorkerAuthGuard } from '../guards/workerAuth.guard';

/**
 * Authorization декоратор:
 * - Якщо передані ролі (наприклад, DOCTOR, ADMIN) → перевіряє авторизацію та доступність цих ролей.
 * - Якщо ролі не передані → перевіряє лише авторизацію.
 */

/**
 * methods use
 * allow only worker auth (any type)
 * - @Authorization()
 * allow only worker auth for type
 * - @Authorization(SpecialtyType.ADMIN)
 */

export function Authorization(...roles: SpecialtyType[]) {
  if (roles.length > 0) {
    const roleConfig: RoleConfig = { type: roles as string[] };
    return applyDecorators(
      Roles(roleConfig),
      UseGuards(WorkerAuthGuard, RolesGuard),
    );
  }
  return applyDecorators(UseGuards(WorkerAuthGuard));
}
