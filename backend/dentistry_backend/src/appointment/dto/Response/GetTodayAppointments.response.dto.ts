import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentCommonDto } from './BaseType/AppointmentCommon.response.dto';
import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';
import { WorkerWithSpecialtyAndDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkersWithSpecialtyAndDentistry.response.dto';
import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';
import { AppointmentActionCommonDto } from '@/appointment-action/dto/Response/BaseType/AppointmentActionCommon.response.dto';

export class GetTodayAppointmentsResponseDto extends AppointmentCommonDto {
  @ApiProperty({
    description: 'Клієнт, який записан до зустрічі',
    type: ClientCommonDto,
  })
  @ApiProperty({ type: () => ClientCommonDto })
  @Type(() => ClientCommonDto)
  @Expose()
  client: ClientCommonDto;

  @ApiProperty({
    description: 'Працівник',
    type: WorkerCommonDto,
  })
  @ApiProperty({ type: () => WorkerWithSpecialtyAndDentistryDto })
  @Type(() => WorkerWithSpecialtyAndDentistryDto)
  @Expose()
  dentist: WorkerWithSpecialtyAndDentistryDto;

  @Type(() => PaymentCommonDto)
    @Expose()
    @ApiProperty({ type: () => PaymentCommonDto, description: 'Оплата запису' })
    payment: PaymentCommonDto;

    
  @Type(() => AppointmentActionCommonDto)
    @Expose()
    @ApiProperty({ type: () => AppointmentActionCommonDto, description: 'Дії у записях' })
    appointment_actions:AppointmentActionCommonDto[];
}
