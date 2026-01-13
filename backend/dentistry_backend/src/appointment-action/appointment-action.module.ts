import { Module } from '@nestjs/common';
import { AppointmentActionService } from './appointment-action.service';
import { AppointmentActionController } from './appointment-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentActions } from './entity/appointment-action.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AppointmentActions])],
  controllers: [AppointmentActionController],
  providers: [AppointmentActionService],
  exports:[AppointmentActionService]
})
export class AppointmentActionModule {}
