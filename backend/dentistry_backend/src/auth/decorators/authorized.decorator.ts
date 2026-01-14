import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Worker } from '../../workers/entities/workers.entity';

/**
 * Призначення: кастомний декоратор для отримання даних про авторизованого працівника (Worker).
 * Як працює:
 * - request.user — сюди NestJS кладе користувача після проходження AuthGuard.
 * - Якщо передати data (наприклад, Authorized('login')), то повернеться конкретне поле працівника.
 * - Якщо data не передано (Authorized()), то повертається весь об’єкт Worker.
 */
// export const Authorized = createParamDecorator(
//   (data: keyof Worker, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const worker = request.user as Worker;

//     return data ? worker[data] : worker;
//   },
// );


import { Client } from 'src/clients/entities/client.entity';

export const Authorized = createParamDecorator(
  (data: keyof Worker | keyof Client, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as Worker | Client;
    return data ? user[data] : user;
  },
);
