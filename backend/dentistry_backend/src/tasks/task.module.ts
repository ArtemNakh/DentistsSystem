import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NotificationModule } from '../notification/notification.module';
import { TasksService } from './task.service';
import { AppointmentModule } from '@/appointment/appointment.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    NotificationModule,
    AppointmentModule, 
  ],
  providers: [TasksService],
})
export class TasksModule {}
