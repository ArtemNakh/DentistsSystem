import { Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('test/all')
  findAll() {
    return this.notificationService.findAll();
  }

  @Post(':dentistryId/remind-appointment')
  async sendAppointmentsRemind(@Param('dentistryId') dentistryId: number) {
    return await this.notificationService.remindAboutAppointment({
      dentistryId,
    });
  }

  @Post(':dentistryId/remind-pay')
  async sendPayRemind(@Param('dentistryId') dentistryId: number) {
    return await this.notificationService.remindAboutPay({
      dentistryId,
    });
  }

  async sendUpdaydReminder() {}
}
