import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('test/all')
  findAll() {
    return this.notificationService.findAll();
  }

  //TWILIO
  @Post('/SendOtp')
  @ApiOperation({ summary: 'Надіслати OTP на телефон' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '9876543210' },
      },
    },
  })
  async sendOtp(@Body() date: { phone: string }): Promise<{ msg: string }> {
    let prefix = '+380';
    let phone = prefix.concat(date.phone);
    return await this.notificationService.sendOtp(phone);
  }

  @Post('/VerifyOtp')
  @ApiOperation({ summary: 'Перевірити OTP код' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '9876543210' },
        otp: { type: 'string', example: '123456' },
      },
    },
  })
  async verifyOtp(
    @Body() data: { phone: string; otp: string },
  ): Promise<{ msg: string }> {
    let prefix = '+380';
    let phone = prefix.concat(data.phone);
    return await this.notificationService.verifyOtp(phone, data.otp);
  }
}
