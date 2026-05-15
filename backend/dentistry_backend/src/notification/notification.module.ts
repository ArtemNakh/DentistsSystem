import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { EmailModule } from 'src/libs/email/email.module';
import { SmsModule } from 'src/libs/sms/sms.module';
@Module({
  imports: [TypeOrmModule.forFeature([Notification]), EmailModule, SmsModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
