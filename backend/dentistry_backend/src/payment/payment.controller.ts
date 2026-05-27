import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payment } from './entity/payment.entity';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { GetPaymentsByDentistDto } from './dto/Query/GetPaymentsByDentist.dto';
import { GetPaymentsByDentistryDto } from './dto/Query/GetPaymentsByDentistry.dto';
import { GetPaymentsByWorkerResponseDto } from './dto/Response/GetPaymentsByWorker.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetPaymentsByDentistryResponseDto } from './dto/Response/GetPaymentsByDentistry.response.dto';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('allByWorker')
  @ApiOperation({
    summary: 'Отримання усіх платежів лікаря',
    description:
      'Повертає список усіх платежів, що належать певному лікарю (dentist). Використовується для фінансової аналітики та історії операцій.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список платежів лікаря',
    type: GetPaymentsByWorkerResponseDto,
    isArray: true,
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
  ): Promise<GetPaymentsByWorkerResponseDto[]> {
    const { dentistId } = query;
    const payments = await this.paymentService.getPaymentsByDentist(dentistId);

    return plainToInstance(GetPaymentsByWorkerResponseDto, payments, {
      excludeExtraneousValues: true,
    });
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
    type: GetPaymentsByDentistryResponseDto,
    isArray: true,
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
  ): Promise<GetPaymentsByDentistryResponseDto[]> {
    const { dentistryId } = query;
    const payments =
      await this.paymentService.getPaymentsByDentistry(dentistryId);

    return plainToInstance(GetPaymentsByDentistryResponseDto, payments, {
      excludeExtraneousValues: true,
    });
  }
}
