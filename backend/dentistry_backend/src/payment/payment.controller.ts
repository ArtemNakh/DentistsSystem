import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payment } from './entity/payment.entity';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { GetPaymentsByDentistDto } from './dto/Query/GetPaymentsByDentist.dto';
import { GetPaymentsByDentistryDto } from './dto/Query/GetPaymentsByDentistry.dto';
import { ClientAuthGuard } from '@/auth/guards/clientAuth.guard';
import { ClientOrWorkerGuard } from '@/auth/guards/ClientOrWorkerGuard.quard';
import { ClientOrWorker } from '@/auth/decorators/ClientOrWorker.decorator';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('test/all')
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('allByWorker')
  @ApiOperation({
    summary: 'Отримання усіх платежів лікаря',
    description:
      'Повертає список усіх платежів, що належать певному лікарю (dentist). Використовується для фінансової аналітики та історії операцій.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список платежів лікаря',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 145 },
          amount: { type: 'number', example: 1200 },
          payment_method: { type: 'string', example: 'card' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-11T10:15:32.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-11T10:15:32.000Z',
          },

          appointment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 88 },
              date: { type: 'string', format: 'date', example: '2026-03-10' },
              time: { type: 'string', example: '14:30' },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-03-10T09:00:00.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-03-10T09:00:00.000Z',
              },

              client: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 52 },
                  name: { type: 'string', example: 'John' },
                  surname: { type: 'string', example: 'Doe' },
                  phone: { type: 'string', example: '+380501234567' },
                },
              },

              dentist: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 12 },
                  name: { type: 'string', example: 'Olena' },
                  surname: { type: 'string', example: 'Koval' },
                  specialty: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 3 },
                      name: { type: 'string', example: 'Orthodontist' },
                      type: { type: 'string', example: 'doctor' },
                    },
                  },
                },
              },

              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 4 },
                  name: { type: 'string', example: 'White Smile Clinic' },
                  address: {
                    type: 'string',
                    example: 'Berlin, Hauptstrasse 12',
                  },
                },
              },

              actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 7 },
                    name: { type: 'string', example: 'Cleaning' },
                    price: { type: 'number', example: 500 },
                  },
                },
              },

              operation_list: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 3 },
                    name: { type: 'string', example: 'X-Ray' },
                    price: { type: 'number', example: 300 },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Лікаря не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Dentist with ID 12 not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getPaymentsByDentist(
    @Query() query: GetPaymentsByDentistDto,
  ): Promise<Payment[]> {
    const { dentistId } = query;
    return this.paymentService.getPaymentsByDentist(dentistId);
  }

  @Get('allByDentistry')
  @ApiOperation({
    summary: 'Отримання усіх платежів стоматології',
    description:
      'Повертає список усіх платежів, що належать певній стоматології. Використовується для фінансової аналітики та перегляду історії операцій.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список платежів стоматології',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 145 },
          amount: { type: 'number', example: 1200 },
          payment_method: { type: 'string', example: 'card' },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-11T10:15:32.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-11T10:15:32.000Z',
          },

          appointment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 88 },
              date: { type: 'string', example: '2026-03-10' },
              time: { type: 'string', example: '14:30' },

              client: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 52 },
                  name: { type: 'string', example: 'John' },
                  surname: { type: 'string', example: 'Doe' },
                  phone: { type: 'string', example: '+380501234567' },
                },
              },

              dentist: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 12 },
                  name: { type: 'string', example: 'Olena' },
                  surname: { type: 'string', example: 'Koval' },
                },
              },

              dentistry: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 4 },
                  name: { type: 'string', example: 'White Smile Clinic' },
                  address: {
                    type: 'string',
                    example: 'Berlin, Hauptstrasse 12',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологію не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Dentistry with ID 4 not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  async getPaymentsByDentistry(
    @Query() query: GetPaymentsByDentistryDto,
  ): Promise<Payment[]> {
    const { dentistryId } = query;
    return this.paymentService.getPaymentsByDentistry(dentistryId);
  }
}
