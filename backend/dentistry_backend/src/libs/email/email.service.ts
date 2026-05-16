import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { InfoAboutAppointmentTemplate } from './templates/infoAboutAppointment.template';
import { AppointmentReminderTemplate } from './templates/remindAboutAppointment.template';
import { PaymentReminderTemplate } from './templates/remindAboutPay.template';

@Injectable()
export class EmailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('APPLICATION_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));
    return this.sendMail(email, 'Verification email', html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('APPLICATION_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));
    return this.sendMail(email, 'Reset password', html);
  }

  public async sendInformPlannedAppointment({
    email,
    textMessage,
  }: {
    email: string;
    textMessage: string;
  }) {
    const html = await render(InfoAboutAppointmentTemplate({ textMessage }));
    return this.sendMail(email, 'Information about planned appointment', html);
  }

  public async sendRemaindAboutAppointment({
    email,
    doctorName,
    appointmentDate,
  }: {
    email: string;
    doctorName: string;
    appointmentDate: string;
  }) {
    const html = await render(
      AppointmentReminderTemplate({ doctorName, appointmentDate }),
    );
    return this.sendMail(email, 'Remind about appointment', html);
  }

  public async sendRemindAboutPay({
    email,
    doctorName,
    appointmentDate,
  }: {
    email: string;
    doctorName: string;
    appointmentDate: string;
  }) {
    const html = await render(
      PaymentReminderTemplate({ doctorName, appointmentDate }),
    );
    return this.sendMail(email, 'Remaind about pay for appointment', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({ to: email, subject, html });
  }
}
