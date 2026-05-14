import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { INotification, TypeRemaind } from './entity/notification.interface';
import { Notification } from './entity/notification.entity';
import { Twilio } from 'twilio';
import { IAppointment } from 'src/appointment/entity/appointment.interface';
import { EmailService } from 'src/libs/email/email.service';

@Injectable()
export class NotificationService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly emailService: EmailService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  findAll(): Promise<INotification[]> {
    return this.notificationRepo.find({ relations: ['appointment'] });
  }

  async informPlannedAppointment({
    appointment,
  }: {
    appointment: IAppointment;
  }) {
    if (!appointment || !appointment.id) {
      throw new BadRequestException(
        'Appointment ID is required for notification',
      );
    }
    
    const messageAboutPlannedAppointment =
      'You have schedule appointment to doctor:' +
      // appointment.dentist.surname +
      // appointment.dentist.name +
      // appointment.dentist.middle_name +
      '  on' +
      appointment.appointment_date.toString();
    const testmessageAboutPlannedAppointment = 't';
    const newNotification = this.notificationRepo.create({
      appointment: { id: appointment.id },
      message: messageAboutPlannedAppointment,
      is_send: false,
      type_remaind: TypeRemaind.GENERAL,
      // type_remaind: TypeRemaind.PLANNED_APPOINTMENT,
    });

    try {
      const savedNotification =
        await this.notificationRepo.save(newNotification);

      try {
        // // Повідомлення на телефон (twilio)
        await this.sendPlannedAppointmentSms(
          appointment.client.phone,
          testmessageAboutPlannedAppointment,
        );

        //Відправка повідомлення на пошту
        await this.emailService.sendInformPlannedAppointment({email:appointment.client.email, textMessage:messageAboutPlannedAppointment})

        // Якщо відправка успішна — оновлюємо статус
        savedNotification.is_send = true;
        await this.notificationRepo.save(savedNotification);
      } catch (sendError) {
        // Якщо відправка впала — логування, але notification лишається зі статусом false
        console.error('Failed to send notification message:', sendError);
      }

      return savedNotification;
    } catch (error: any) {
      console.log('errorqweqwe', error.message);
      throw new InternalServerErrorException(
        `Failed to save notification: ${error.message}`,
      );
    }
  }

  async nearestAppointment() {}

  async sendPlannedAppointmentSms(
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
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to send SMS: ${error.message}`,
      );
    }
  }

  // async sendOtp(phoneNumber: string) {
  //   const serviceSid = this.configService.get(
  //     'TWILIO_VERIFICATION_SERVICE_SID',
  //   );
  //   let msg = '';
  //   await this.twilioClient.verify.v2
  //     .services(serviceSid)
  //     .verifications.create({ to: phoneNumber, channel: 'sms' })
  //     .then((verification) => (msg = verification.status));
  //   return { msg: msg };
  // }

  // async verifyOtp(phoneNumber: string, code: string) {
  //   const serviceSid = this.configService.get(
  //     'TWILIO_VERIFICATION_SERVICE_SID',
  //   );
  //   let msg = '';
  //   await this.twilioClient.verify.v2
  //     .services(serviceSid)
  //     .verificationChecks.create({ to: phoneNumber, code: code })
  //     .then((verification) => (msg = verification.status));
  //   return { msg: msg };
  // }
}
