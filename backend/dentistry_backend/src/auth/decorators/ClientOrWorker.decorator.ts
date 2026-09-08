import { applyDecorators, UseGuards } from '@nestjs/common';
import { ClientOrWorkerGuard } from '../guards/ClientOrWorkerGuard.quard';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { RoleConfig, Roles } from './roles-decorator';
import { WorkerRoleGuard } from '../guards/WorkerRoleGuard.quard';

// 🎯 Призначення
// @ClientOrWorker() — це універсальний декоратор авторизації, який дозволяє:
// надавати доступ клієнтам
// надавати доступ працівникам
// при необхідності — обмежувати доступ працівникам за ролями
// при цьому клієнти завжди мають доступ, незалежно від ролей

// ⚙️ Як працює логіка
// ✔ Якщо ролі НЕ передані:
// @ClientOrWorker()
// клієнт → доступ
// будь‑який працівник → доступ
// ролі не перевіряються
// ✔ Якщо ролі передані:
// @ClientOrWorker(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
// клієнт → доступ (ролі ігноруються)
// працівник → доступ тільки якщо його роль у списку
// інші працівники → Forbidden

// way of using
// allow client and worker(any type) auth
// -    @ClientOrWorker()
// allow client and worker (by type) auth
// -    @ClientOrWorker(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)\

export function ClientOrWorker(...roles: SpecialtyType[]) {
  // Якщо ролей немає → пропускаємо всіх працівників і клієнтів
  if (roles.length === 0) {
    return applyDecorators(UseGuards(ClientOrWorkerGuard, WorkerRoleGuard));
  }

  // Якщо ролі є → перевіряємо їх тільки для працівників
  const roleConfig: RoleConfig = { type: roles as string[] };

  return applyDecorators(
    Roles(roleConfig),
    UseGuards(ClientOrWorkerGuard, WorkerRoleGuard),
  );
}
