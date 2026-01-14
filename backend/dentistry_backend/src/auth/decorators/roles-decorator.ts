import { SetMetadata } from '@nestjs/common';
import { SpecialtyType } from 'src/specialty/entities/specialty.interface';

export const ROLES_KEY = 'roles';

/**
 * Декоратор Roles:
 * - Додає метадані до ендпоінта з переліком дозволених ролей.
 * - Використовується разом із RolesGuard для перевірки доступу.
 */
// export const Roles = (...roles: SpecialtyType[] | string[]) => SetMetadata(ROLES_KEY, roles);



export interface RoleConfig {
  name?: string | string[];
  type?: string | string[];
}

export const Roles = (config: RoleConfig | string) => {
  // Якщо передана просто строка — перетворити в об'єкт
  const roleConfig: RoleConfig = typeof config === 'string' 
    ? { name: config } 
    : config;
  
  return SetMetadata(ROLES_KEY, roleConfig);
};