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

  async sendPlannedAppointmentSms(
    phoneNumber: string,
    textNotification: string,
  ) {
    try {
      console.log('phone_number', phoneNumber, '  text', textNotification);
      const message = await this.twilioClient.messages.create({
        body: textNotification,
        from: this.configService.get('TWILIO_SENDER_PHONE_NUMBER'),
        to: phoneNumber,
      });
      console.log('message', message);
      return { sid: message.sid, status: message.status };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to send SMS: ${error.message}`,
      );
    }
  }

  //   async sendOtp(phoneNumber: string) {
  //     const serviceSid = this.configService.get('TWILIO_VERIFICATION_SERVICE_SID');
  //     const verification = await this.twilioClient.verify.v2
  //       .services(serviceSid)
  //       .verifications.create({ to: phoneNumber, channel: 'sms' });

  //     return { msg: verification.status };
  //   }

  //   async verifyOtp(phoneNumber: string, code: string) {
  //     const serviceSid = this.configService.get('TWILIO_VERIFICATION_SERVICE_SID');
  //     const verification = await this.twilioClient.verify.v2
  //       .services(serviceSid)
  //       .verificationChecks.create({ to: phoneNumber, code });

  //     return { msg: verification.status };
  //   }
}
