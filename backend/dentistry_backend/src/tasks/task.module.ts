import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NotificationModule } from '../notification/notification.module';
import { DentistryModule } from '../dentistry/dentistry.module';
import { TasksService } from './task.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    NotificationModule,
    DentistryModule, 
  ],
  providers: [TasksService],
})
export class TasksModule {}
