import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { GetPaymentsByDentistDto } from './dto/Query/GetPaymentsByDentist.dto';
import { GetPaymentsByDentistryDto } from './dto/Query/GetPaymentsByDentistry.dto';
import { GetPaymentsByWorkerResponseDto } from './dto/Response/GetPaymentsByWorker.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetPaymentsByDentistryResponseDto } from './dto/Response/GetPaymentsByDentistry.response.dto';
import { CompletePaymentParams } from './dto/Params/CompletePayment.param.dto';
import { CompletePaymentResponseDto } from './dto/Response/CompletePayment.response.dto';

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
    const { dentistId, take, skip } = query;
    const payments = await this.paymentService.getPaymentsByDentist(
      dentistId,
      take,
      skip,
    );

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
  @Authorization(
    SpecialtyType.ADMIN,
    SpecialtyType.RECEPTION,
    SpecialtyType.DOCTOR,
  )
  async getPaymentsByDentistry(
    @Query() query: GetPaymentsByDentistryDto,
  ): Promise<GetPaymentsByDentistryResponseDto[]> {
    const { dentistryId, take, skip } = query;
    const payments = await this.paymentService.getPaymentsByDentistry(
      dentistryId,
      take,
      skip,
    );

    return plainToInstance(GetPaymentsByDentistryResponseDto, payments, {
      excludeExtraneousValues: true,
    });
  }

  @Get('complete_payment/:appointmentId')
  @ApiOperation({
    summary: 'Виконання платежу по запису',
    description: 'Виконує зміни статусів по оплаті.',
  })
  @ApiResponse({
    status: 200,
    description: 'Платіж запису',
    type: CompletePaymentResponseDto,
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
  @Authorization(SpecialtyType.RECEPTION)
  async completePayment(
    @Param() params: CompletePaymentParams,
  ): Promise<CompletePaymentResponseDto> {
    const { appointmentId } = params;
    const payment = await this.paymentService.CompletePayment(appointmentId);
    return plainToInstance(GetPaymentsByDentistryResponseDto, payment, {
      excludeExtraneousValues: true,
    });
  }
}
