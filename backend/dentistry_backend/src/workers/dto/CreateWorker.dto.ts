import { IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkerDto {
  @ApiProperty({ example: 'Іван', description: 'Імʼя працівника' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Петренко', description: 'Прізвище працівника' })
  @IsString()
  surname: string;

  @ApiProperty({ example: 'Іванович', description: 'По батькові працівника' })
  @IsString()
  middle_name: string;

  @ApiProperty({
    example: '1990-05-20',
    description: 'Дата народження у форматі YYYY-MM-DD',
  })
  @IsDateString()
  birthday: string;

  @ApiProperty({ example: '+380501234567', description: 'Телефон працівника' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 1, description: 'ID спеціальності' })
  @IsNumber()
  specialtyId: number;

  @ApiProperty({ example: 2, description: 'ID стоматології' })
  @IsNumber()
  dentistryId: number;

  @ApiProperty({ example: 'ivan.petrenko', description: 'Логін для входу' })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Пароль для входу',
  })
  @IsString()
  password: string;
}
