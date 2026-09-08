
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WorkerWithSpecialtyDto } from '@/workers/dto/Response/BaseType/partials/WorkerWithSpecialty.response.dto';

export class LoginWorkerResponseDto {
  @ApiProperty({
    description: 'JWT токен для авторизації працівника',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  authToken: string;

  @ApiProperty({
    description: 'Базова інформація про працівника',
    type: WorkerWithSpecialtyDto,
    example: {
      id: 12,
      name: 'Іван',
      surname: 'Петренко',
      middle_name: 'Олегович',
      phone: '+380931234567',
      login: 'ivan.petrenko',
      specialty: { id: 1, title: 'Стоматолог-хірург' },
      dentistry: { id: 2, name: 'Dentistry Clinic №1' },
    },
  })
  @Expose()
  @Type(() => WorkerWithSpecialtyDto)
  worker: WorkerWithSpecialtyDto;
}
