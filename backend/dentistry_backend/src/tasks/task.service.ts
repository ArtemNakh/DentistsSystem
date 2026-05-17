import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { DentistryService } from '../dentistry/dentistry.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly dentistryService: DentistryService,
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
}
