import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private readonly twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    this.twilioClient = new Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSmsForClient(
    phoneNumber: string,
    textNotification: string,
  ) {
    try {
      const message = await this.twilioClient.messages.create({
        body: textNotification,
        from: this.configService.get('TWILIO_SENDER_PHONE_NUMBER'),
        to: phoneNumber,
      });
      return { sid: message.sid, status: message.status };
    return{}
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to send SMS: ${error.message}`,
      );
    }
  }

  
  

}
