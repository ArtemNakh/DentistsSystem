import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Декоратор Roles:
 * - Додає метадані до ендпоінта з переліком дозволених ролей.
 * - Використовується разом із RolesGuard для перевірки доступу.
 */

export interface RoleConfig {
  name?: string | string[];
  type?: string | string[];
}

export const Roles = (config: RoleConfig | string) => {
    
  const roleConfig: RoleConfig =
    typeof config === 'string' ? { name: config } : config;

  return SetMetadata(ROLES_KEY, roleConfig);
};
