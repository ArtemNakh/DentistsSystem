import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentActionService } from './appointment-action.service';
import { CreateAppointmentActionsDto } from './dto/CreateAppointmentActionsDto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';

import { plainToInstance } from 'class-transformer';
import { CompleteOperationResponseDto } from './dto/Response/CompleteOperation.response.dto';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { Worker } from '@/workers/entities/workers.entity';

@Controller('appointment-action')
export class AppointmentActionController {
  constructor(
    private readonly appointmentActionService: AppointmentActionService,
  ) {}

  @Post('CompleteOperation')
  @ApiOperation({
    summary: 'Додати операції до запису та створити платіж',
    description:
      'Приймає масив операцій (appointment_actions), створює їх для конкретного appointment, ' +
      'перераховує загальну суму, оновлює статус appointment (WAIT_PAID) та створює запис у payment.',
  })
  @ApiBody({
    type: CreateAppointmentActionsDto,
    description:
      'DTO з ID запису, масивом ID операцій та способом оплати (CARD, CASH, TRANSFER)',
    examples: {
      example1: {
        summary: 'Додати операції до запису',
        value: {
          appointmentId: 12,
          actions: [3, 5, 7],
          method_pay: 'CARD',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Повертає оновлений appointment з діями та створеним payment',
    type: CompleteOperationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані або відсутні операції',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid appointmentId or actions array',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Працівник не авторизований',
    schema: {
      example: {
        statusCode: 401,
        message: 'Працівник не авторизований',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав (не DOCTOR)',
    schema: {
      example: {
        statusCode: 403,
        message: 'Недостатньо прав. Ваша роль не має доступу',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Запис не знайдені',
    schema: {
      example: {
        statusCode: 404,
        message: 'Appointment not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  @ApiBody({
    type: CreateAppointmentActionsDto,
    description:
      'DTO з ID запису, масивом ID операцій та способом оплати (CARD, CASH, TRANSFER)',
    examples: {
      example1: {
        summary: 'Додати операції до запису',
        value: {
          appointmentId: 12,
          actions: [3, 5, 7],
          method_pay: 'CARD',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Повертає оновлений appointment з доданими діями та створеним payment',
    schema: {
      example: {
        appointment: {
          id: 12,
          status: 'wait_paid',
          client: { id: 1, surname: 'Іваненко', name: 'Іван' },
          dentist: { id: 2, surname: 'Петренко', name: 'Петро' },
          appointment_date: '2026-03-31T21:00:00Z',
        },
        actions: [
          { id: 101, operation: { id: 3, name: 'Пломбування', price: 500 } },
          { id: 102, operation: { id: 5, name: 'Чистка', price: 300 } },
        ],
        payment: {
          id: 55,
          appointment: 12,
          amount: 800,
          status_paid: 'not_paid',
          method_pay: 'CARD',
          payment_date: '2026-03-31T22:00:00Z',
        },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.DOCTOR)
  async addActionsAndPayment(
    @Body() dto: CreateAppointmentActionsDto, @Authorized() worker: Worker,
  ): Promise<CompleteOperationResponseDto> {
    const completeAppointment =
      await this.appointmentActionService.addActionsAndPayment(dto,worker.id);

    return plainToInstance(CompleteOperationResponseDto, completeAppointment, {
      excludeExtraneousValues: true,
    });
  }
}
