import { Controller, Get } from '@nestjs/common';
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
}
