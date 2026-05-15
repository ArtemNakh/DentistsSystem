import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotification, TypeRemaind } from './entity/notification.interface';
import { Notification } from './entity/notification.entity';
import { IAppointment } from 'src/appointment/entity/appointment.interface';
import { EmailService } from 'src/libs/email/email.service';
import { SmsService } from 'src/libs/sms/sms.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

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

    console.log('aqweqwe', appointment);
    const messageAboutPlannedAppointment =
      'You have schedule appointment to doctor:' +
      ' ' +
      appointment.dentist.surname +
      ' ' +
      appointment.dentist.name +
      ' ' +
      appointment.dentist.middle_name +
      '  on ' +
      appointment.appointment_date.toString();
    const newNotification = this.notificationRepo.create({
      appointment: { id: appointment.id },
      message: messageAboutPlannedAppointment,
      is_send: false,
      type_remaind: TypeRemaind.PLANNED_APPOINTMENT,
    });

    try {
      const savedNotification =
        await this.notificationRepo.save(newNotification);

      try {
        // Повідомлення про додавання запису до стоматолога на телефон (twilio)
        await this.smsService.sendSmsForClient(
          appointment.client.phone,
          messageAboutPlannedAppointment,
        );

        //Відправка повідомлення на пошту
        await this.emailService.sendInformPlannedAppointment({
          email: appointment.client.email,
          textMessage: messageAboutPlannedAppointment,
        });

        // Якщо відправка успішна — оновлюємо статус
        savedNotification.is_send = true;
        await this.notificationRepo.save(savedNotification);
      } catch (sendError) {
        // Якщо відправка впала — логування, але notification лишається зі статусом false
        console.error('Failed to send notification message:', sendError);
      }

      return savedNotification;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to save notification: ${error.message}`,
      );
    }
  }

  async nearestAppointment() {}
}
