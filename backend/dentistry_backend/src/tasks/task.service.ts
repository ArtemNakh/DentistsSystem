import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { AppointmentService } from '@/appointment/appointment.service';
import { StatusAppointment } from '@/appointment/entity/appointment.interface';

@Injectable()
export class TasksService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly appointmentService: AppointmentService,
  ) {}

  // CRON: щохвилини '0 * * * * *' / для щоденного о 9:00  '0 9 * * *'
  //   For real use
  //   @Cron('0 * * * * *')
  //   async handleDailyReminder() {
  //     const dentistries = await this.dentistryService.findAll();
  //      for (const dentistry of dentistries) {
  //       await this.notificationService.remindAboutAppointment({
  //         dentistryId:dentistry.id,
  //       });
  //     }
  //   }

  //   test example
  //   кожні 5 хвилин
  //   @Cron('0 */5 * * * *')
  // кожні 10 хвилин
  //   @Cron('0 */10 * * * *')

  //   кожна хвилина
  // @Cron('0 * * * * *')
  //   об 9 годині
  @Cron('0 9 * * *')
  async handleDailyReminder() {
    const dentistries = [{ id: 1 }];
    for (const dentistry of dentistries) {
      // Відправка повідомлень про скору запись до стоматолога
      await this.notificationService.remindAboutAppointment({
        dentistryId: dentistry.id,
      });

      //   Відправка повідомлень про неоплачену операцію
      await this.notificationService.remindAboutPay({
        dentistryId: dentistry.id,
      });
    }
  }

  // щогодини перевірка операцій
  @Cron('0 * * * *')
  // @Cron('*/2 * * * *')
  async handleHourlyCheck() {
    const now = new Date();

    // отримати всі операції зі статусом schedule/wait_paid
    const operations = await this.appointmentService.findActiveOperations();

    for (const operation of operations) {
      const operationDate = new Date(operation.appointment_date);

      // різниця у годинах
      const diffHours =
        (now.getTime() - operationDate.getTime()) / (1000 * 60 * 60);

      if (diffHours > 2) {
        // оновити статус на cancelled
        console.log('oper', operation.id);
        await this.appointmentService.updateStatus(
          operation.id,
          StatusAppointment.CANCELLED,
        );
      }
    }
  }
}
