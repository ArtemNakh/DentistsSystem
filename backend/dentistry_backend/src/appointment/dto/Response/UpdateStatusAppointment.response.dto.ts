import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AppointmentCommonDto } from './BaseType/AppointmentCommon.response.dto';

export class MessageDto {
  @Expose()
  @ApiProperty({ example: 'success', description: 'Код повідомлення' })
  code: string;

  @Expose()
  @ApiProperty({
    example: 'Appointment 1427 status updated to cancelled',
    description: 'Текст повідомлення',
  })
  text: string;
}

export class UpdateStatusAppointmentResponseDto {
  @Expose()
  @Type(() => MessageDto)
  @ApiProperty({ type: () => MessageDto })
  message: MessageDto;

  @Expose()
  @Type(() => AppointmentCommonDto)
  @ApiProperty({ type: () => AppointmentCommonDto, isArray: true })
  data: AppointmentCommonDto[];
}
