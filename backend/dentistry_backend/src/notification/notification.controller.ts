import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { INotification } from './entity/notification.interface';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('test/all')
  findAll() {
    return this.notificationService.findAll({});
  }

  @Post(':dentistryId/remind-appointment')
    @UseInterceptors(ClassSerializerInterceptor)
  async sendAppointmentsRemind(@Param('dentistryId') dentistryId: number) {
    return await this.notificationService.remindAboutAppointment({
      dentistryId,
    });
  }

  @Post(':dentistryId/remind-pay')
    @UseInterceptors(ClassSerializerInterceptor)
  async sendPayRemind(@Param('dentistryId') dentistryId: number) {
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
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    example: '2026-05-17',
    description: 'Дата у форматі yyyy-MM-dd ',
  })
  @ApiQuery({
    name: 'dentistryId',
    required: true,
    type: Number,
    example: 1,
    description: 'ID стоматології ',
  })
  @ApiResponse({
    status: 200,
    description: 'Список нотифікацій',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний формат дати',
  })
    @UseInterceptors(ClassSerializerInterceptor)
  async getNearest(
    @Query('date') date: string,
    @Query('dentistryId', ParseIntPipe) dentistryId: number,
  ): Promise<INotification[]> {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Некоректний формат дати');
    }

    const notifications = await this.notificationService.findAll({
      date: parsedDate,
      dentistryId: dentistryId,
    });

    console.log('notif', notifications);
    return notifications;
  }
}
