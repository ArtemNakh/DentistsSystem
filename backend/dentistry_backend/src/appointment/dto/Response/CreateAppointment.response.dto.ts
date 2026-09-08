import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentCommonDto } from './BaseType/AppointmentCommon.response.dto';
import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';
import { WorkerPublicDto } from '@/workers/dto/Response/BaseType/WorkersPublic.response.dto';
import { WorkerWithSpecialtyAndDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkersWithSpecialtyAndDentistry.response.dto';
import { AppointmentActionCommonDto } from '@/appointment-action/dto/Response/BaseType/AppointmentActionCommon.response.dto';
import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';

export class CreateAppointmentResponseDto extends AppointmentCommonDto {
  @ApiProperty({
    description: 'Клієнт, який записан до зустрічі',
    type: ClientCommonDto,
  })
  @ApiProperty({ type: () => ClientCommonDto })
  @Type(() => ClientCommonDto)
  @Expose()
  client: ClientCommonDto;

  @ApiProperty({
    description: 'Працівник, який буде вести операцію',
    type: WorkerWithSpecialtyAndDentistryDto,
  })
  @ApiProperty({ type: () => WorkerWithSpecialtyAndDentistryDto })
  @Type(() => WorkerWithSpecialtyAndDentistryDto)
  @Expose()
  dentist: WorkerWithSpecialtyAndDentistryDto;

  @ApiProperty({
    description: 'Дії які були зроблені',
    type: AppointmentActionCommonDto,
  })
  @ApiProperty({ type: () => AppointmentActionCommonDto })
  @Type(() => AppointmentActionCommonDto)
  @Expose()
  appointment_actions: AppointmentActionCommonDto[];

  
  @ApiProperty({
    description: 'Оплата запису',
    type: PaymentCommonDto,
  })
  @ApiProperty({ type: () => PaymentCommonDto })
  @Type(() => PaymentCommonDto)
  @Expose()
  payment: PaymentCommonDto[];
}
