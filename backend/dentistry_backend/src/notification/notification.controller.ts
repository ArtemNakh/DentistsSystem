import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { RemindPaymentParamDto } from './dto/Params/RemindPayment.params.dto';
import { RemindAppointmentParamDto } from './dto/Params/RemindAppointment.params.dto';
import { GetNearestNotificationsDto } from './dto/Query/GetNearestNotifications.query.dto';
import { GetAllNotificationsResponseDto } from './dto/Response/GetAllNotifications.response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('test/all')
  findAll() {
    return this.notificationService.findAll({});
  }

  @Post(':dentistryId/remind-appointment')
  @ApiOperation({
    summary: 'Відправити нагадування про прийом',
    description:
      'Метод створює та відправляє нагадування клієнтам про прийоми на завтра для вказаної стоматології.',
  })
  @ApiResponse({
    status: 200,
    description: 'Нагадування успішно відправлені',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
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
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 43434 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async sendAppointmentsRemind(@Param() param: RemindAppointmentParamDto) {
    const { dentistryId } = param;
    return await this.notificationService.remindAboutAppointment({
      dentistryId,
    });
  }

  @Post(':dentistryId/remind-pay')
  @ApiOperation({
    summary: 'Відправити нагадування про оплату',
    description:
      'Метод створює та відправляє нагадування клієнтам про оплату для вказаної стоматології.',
  })
  @ApiResponse({
    status: 200,
    description: 'Нагадування успішно відправлені',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dentistryId має бути більше 0',
            'dentistryId має бути цілим числом',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
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
    description: 'Стоматологія не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 43434 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  async sendPayRemind(@Param() param: RemindPaymentParamDto) {
    const { dentistryId } = param;
    return await this.notificationService.remindAboutPay({
      dentistryId,
    });
  }

  @Get('all')
  @ApiOperation({
    summary:
      'Отримати всі сповіщення для певної стоматології та для певного дня',
    description: `Повертає список сповіщень. 
    Можна викликати без параметрів (отримати всі), або з параметрами date та dentistryId для фільтрації.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Нагадування успішно відправлені',
    type: GetAllNotificationsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Список нотифікацій',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректна дата у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['date має бути коректною датою у форматі ISO'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
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
    status: 400,
    description: 'Некоректна дата у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['date має бути коректною датою у форматі ISO'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  @UseInterceptors(ClassSerializerInterceptor)
  async getNearest(
    @Query() query: GetNearestNotificationsDto,
  ): Promise<GetAllNotificationsResponseDto[]> {
    const { date, dentistryId } = query;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Некоректний формат дати');
    }

    const notifications = await this.notificationService.findAll({
      date: parsedDate,
      dentistryId: dentistryId,
    });

    return plainToInstance(GetAllNotificationsResponseDto, notifications, {
      excludeExtraneousValues: true,
    });
  }
}
