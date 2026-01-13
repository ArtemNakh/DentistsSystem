import { Controller, Get } from '@nestjs/common';
import { AppointmentActionService } from './appointment-action.service';

@Controller('appointment-action')
export class AppointmentActionController {
  constructor(
    private readonly appointmentActionService: AppointmentActionService,
  ) {}
  @Get('test/all')
  findAll() {
    return this.appointmentActionService.findAll();
  }
}
