import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppointmentActionService } from './appointment-action.service';
import { CreateAppointmentActionsDto } from './dto/CreateAppointmentActionsDto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('appointment-action')
export class AppointmentActionController {
  constructor(
    private readonly appointmentActionService: AppointmentActionService,
  ) {}
  @Get('test/all')
  findAll() {
    return this.appointmentActionService.findAll();
  }

  @Post('CompleteOperation')
  @ApiOperation({
    summary: 'Додати операції до запису',
    description:
      'Приймає масив операцій (appointment_actions), створює їх для конкретного appointment, ' +
      'оновлює статус appointment (WAIT_PAID або COMPLETED) та створює запис у payment.',
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
  async addActionsAndPayment(@Body() dto: CreateAppointmentActionsDto) {
    return this.appointmentActionService.addActionsAndPayment(dto);
  }
}
