import { Expose, Type } from 'class-transformer';
import { TypeRemaind } from '@/notification/entity/notification.interface';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationCommonDto {
 @Expose()
  @ApiProperty({
    example: 12,
    description: 'Унікальний ідентифікатор сповіщення',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'Appointment reminder for tomorrow at 10:00',
    description: 'Текст повідомлення',
  })
  message: string;

  @Expose()
  @ApiProperty({
    example: true,
    description: 'Чи було відправлено сповіщення',
  })
  is_send: boolean;

  @Expose()
  @ApiProperty({
    enum: TypeRemaind,
    example: TypeRemaind.APPOINTMENT_REMINDER,
    description:
      'Тип сповіщення (наприклад: appointment_reminder, payment_reminder, general, planned_appointment)',
  })
  type_remaind: TypeRemaind;
}
