import { WorkerCommonDto } from '@/workers/dto/Response/BaseType/WorkersCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentCommonDto } from './BaseType/AppointmentCommon.response.dto';
import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';
import { PaymentCommonDto } from '@/payment/dto/Response/BaseType/PaymentCommon.response.dto';
import { AppointmentActionCommonDto } from '@/appointment-action/dto/Response/BaseType/AppointmentActionCommon.response.dto';
import { AppointmentActionWithOperationDto } from '@/appointment-action/dto/Response/partialType/AppointmentActionWithOperation.response.dto';


export class WorkerStatsDto {
  @Expose()
  @ApiProperty({ example: 27, description: 'Загальна кількість записів' })
  total: number;

  @Expose()
  @ApiProperty({ example: 10, description: 'Заплановані записи' })
  schedule: number;

  @Expose()
  @ApiProperty({ example: 7, description: 'Завершені записи' })
  completed: number;

  @Expose()
  @ApiProperty({ example: 7, description: 'Очікують оплати' })
  waitPaid: number;

  @Expose()
  @ApiProperty({ example: 3, description: 'Скасовані записи' })
  cancelled: number;
}

export class GetWorkersStatsResponseDto extends AppointmentCommonDto {
  @Expose()
  @Type(() => WorkerCommonDto)
  @ApiProperty({ type: () => WorkerCommonDto })
  worker: WorkerCommonDto;

  @Expose()
  @Type(() => WorkerStatsDto)
  @ApiProperty({ type: () => WorkerStatsDto })
  stats: WorkerStatsDto;
}
