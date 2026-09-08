import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWorkerDto {
  @ApiProperty({
    description: 'Унікальний логін працівника для входу',
    example: 'ivan.petrenko',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'Пароль працівника (мінімум 6 символів)',
    example: 'securePass123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
