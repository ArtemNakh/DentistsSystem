import { Expose, Type } from 'class-transformer';
import { ClientCommonDto } from './BaseType/ClientCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentCommonDto } from '@/appointment/dto/Response/BaseType/AppointmentCommon.response.dto';
export class GetCurrentClientResponseDto extends ClientCommonDto {
  @ApiProperty({
    description: 'Записи, які є у клієнта',
    type: AppointmentCommonDto,
    isArray: true,
  })
  @ApiProperty({ type: () => AppointmentCommonDto })
  @Type(() => AppointmentCommonDto)
  @Expose()
  appointments: AppointmentCommonDto[];

  
  @ApiProperty({
    example: 'ivan.petrenko@example.com',
    description: 'Пошта від облікового запису клієнта',
  })
  @Expose()
  email: string;
}
