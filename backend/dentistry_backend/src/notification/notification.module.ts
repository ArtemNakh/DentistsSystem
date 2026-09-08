import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { EmailModule } from '@/libs/email/email.module';
import { SmsModule } from '@/libs/sms/sms.module';
import { AppointmentModule } from '@/appointment/appointment.module';
import { WorkersModule } from '@/workers/workers.module';
import { DentistryModule } from '@/dentistry/dentistry.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EmailModule,
    SmsModule,
    forwardRef(() => AppointmentModule),
    WorkersModule,
    DentistryModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
