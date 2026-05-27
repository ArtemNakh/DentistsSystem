import { ClientCommonDto } from '@/clients/dto/Response/BaseType/ClientCommon.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class NewVerificationResponseDto {
  @ApiProperty({
    description: 'JWT токен, який видається після успішної верифікації клієнта',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  authToken: string;

  @ApiProperty({
    description: 'Інформація про клієнта після підтвердження email',
    type: ClientCommonDto,
    example: {
      id: 51,
      name: 'John',
      surname: 'Doe',
      middle_name: 'Michael',
      birthdate: '1990-05-15',
      blood_resus: 'plus',
      blood_group: 2,
      phone: '+1234567890',
      allergic_diseases: 'Pollen',
      email: 'john.doe@example.com',
      isVerified: true,
      created_at: '2026-04-08T15:27:01.000Z',
      updated_at: '2026-05-27T11:08:01.000Z',
    },
  })
  @Expose()
  @Type(() => ClientCommonDto)
  client: ClientCommonDto;
}
