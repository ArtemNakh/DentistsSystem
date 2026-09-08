import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { RoleConfig, ROLES_KEY } from "../decorators/roles-decorator";
import { Reflector } from "@nestjs/core";

// WorkerRoleGuard — що робить
// Якщо ролей немає → пропускає всіх працівників
// Якщо користувач — клієнт → пропускає
// Якщо користувач — працівник → перевіряє specialty.type
// Якщо роль не підходить → ForbiddenException
@Injectable()
export class WorkerRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roleConfig = this.reflector.getAllAndOverride<RoleConfig>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: any = context.switchToHttp().getRequest();
    const user = request.user;

    // Якщо ролей немає → пропускаємо всіх працівників і клієнтів
    if (!roleConfig) return true;

    // Якщо це клієнт → пропускаємо (ролі не стосуються клієнтів)
    if (request.userType === 'client') return true;

    // Якщо це працівник → перевіряємо ролі
    if (roleConfig.type) {
      const allowed = Array.isArray(roleConfig.type)
        ? roleConfig.type
        : [roleConfig.type];

      if (allowed.includes(user.specialty?.type)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `Недостатньо прав. Ваша роль (${user.specialty?.type}) не має доступу`,
    );
  }
}
