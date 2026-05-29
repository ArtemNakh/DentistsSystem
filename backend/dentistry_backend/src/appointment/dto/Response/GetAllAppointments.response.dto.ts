import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentCommonDto } from './BaseType/AppointmentCommon.response.dto';
import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';
import { WorkerWithDentistryDto } from '@/workers/dto/Response/BaseType/partials/WorkerWithDentistry.response.dto copy';

export class GetAllAppointmentsResponseDto extends AppointmentCommonDto {
  @ApiProperty({
    description: 'Клієнт, який записан до зустрічі',
    type: ClientCommonDto,
  })
  @ApiProperty({ type: () => ClientCommonDto })
  @Type(() => ClientCommonDto)
  @Expose()
  client: ClientCommonDto;

  @ApiProperty({
    description: 'Працівник, який веде операцію',
    type: WorkerWithDentistryDto,
  })
  @ApiProperty({ type: () => WorkerWithDentistryDto })
  @Type(() => WorkerWithDentistryDto)
  @Expose()
  dentist: WorkerWithDentistryDto;
}
