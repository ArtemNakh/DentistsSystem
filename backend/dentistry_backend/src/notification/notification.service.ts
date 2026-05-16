import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotification, TypeRemaind } from './entity/notification.interface';
import { Notification } from './entity/notification.entity';
import {
  IAppointment,
  StatusAppointment,
} from 'src/appointment/entity/appointment.interface';
import { EmailService } from 'src/libs/email/email.service';
import { SmsService } from 'src/libs/sms/sms.service';
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
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

    const messageAboutPlannedAppointment =
      'You have a scheduled appointment with Dr. ' +
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

  async remindAboutAppointment({ dentistryId }: { dentistryId: number }) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // отримання усі записів для стоматлогії на завтра
    const tomorrowAppointments =
      await this.appointmentService.findNearestClientsAppoinment({
        dentistryId,
        startDate: new Date(tomorrow.setHours(0, 0, 0, 0)),
        endDate: new Date(tomorrow.setHours(23, 59, 59, 999)),
      });

    for (const appointment of tomorrowAppointments) {
      // створення notifications
      const messageRemindAboutAppointment =
        'Reminder: You have an appointment with Dr. ' +
        appointment.dentist.surname +
        ' ' +
        appointment.dentist.name +
        ' ' +
        appointment.dentist.middle_name +
        ' tomorrow at ' +
        appointment.appointment_date.toLocaleString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

      const newNotification = this.notificationRepo.create({
        appointment: appointment,
        message: messageRemindAboutAppointment,
        is_send: false,
        type_remaind: TypeRemaind.APPOINTMENT_REMINDER,
      });

      await this.notificationRepo.save(newNotification);

      // Надсилання повідомлень
      // Надсилання sms
      await this.smsService.sendSmsForClient(
        appointment.client.phone,
        messageRemindAboutAppointment,
      );

      // Надсилання email
      await this.emailService.sendRemaindAboutAppointment({
        email: appointment.client.email,
        doctorName:
          appointment.dentist.surname +
          ' ' +
          appointment.dentist.name +
          ' ' +
          appointment.dentist.middle_name,
        appointmentDate: new Date(appointment.appointment_date).toLocaleString(
          'uk-UA',
        ),
      });

      // Оновлення notification після успішних відправок
      newNotification.is_send = true;
      await this.notificationRepo.save(newNotification);
    }
  }

  // повідомлення про неоплачену операцію після н-кількості днів
  async remindAboutPay({ dentistryId }: { dentistryId: number }) {
    const now = new Date();
    // отримання усіх записів для стоматології
    const appointments =
      await this.appointmentService.findNearestClientsAppoinment({
        dentistryId,
        endDate: now,
      });


    const unpaidAppointments = appointments.filter(
      (appt) => appt.status === StatusAppointment.WAIT_PAID,
    );

    for (const appointment of unpaidAppointments) {
      const appointmentDate = new Date(appointment.appointment_date);

      // перевірка: якщо пройшло більше ніж 2 дні після операції
      const diffInMs = now.getTime() - appointmentDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays >= 2) {
        const messagePaymentReminder =
          'Reminder: Please complete the payment for your appointment with Dr. ' +
          appointment.dentist.surname +
          ' ' +
          appointment.dentist.name +
          ' ' +
          appointment.dentist.middle_name +
          ' that took place on ' +
          appointmentDate.toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

        // створення notification
        const newNotification = this.notificationRepo.create({
          appointment,
          message: messagePaymentReminder,
          is_send: false,
          type_remaind: TypeRemaind.PAYMENT_REMINDER,
        });
        await this.notificationRepo.save(newNotification);
console.log("appointet",newNotification)
        // Надсилання sms
        // await this.smsService.sendSmsForClient(
        //   appointment.client.phone,
        //   messagePaymentReminder,
        // );

        // Надсилання email
        // await this.emailService.sendRemindAboutPay({
        //   email: appointment.client.email,
        //   doctorName:
        //     appointment.dentist.surname +
        //     ' ' +
        //     appointment.dentist.name +
        //     ' ' +
        //     appointment.dentist.middle_name,
        //   appointmentDate: appointmentDate.toLocaleString('uk-UA'),
        // });

        // Оновлення notification та appointment після успішних відправок
        newNotification.is_send = true;
        await this.notificationRepo.save(newNotification);
      }
    }
  }
}
