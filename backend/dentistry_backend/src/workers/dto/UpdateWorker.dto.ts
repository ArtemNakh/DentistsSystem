import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateWorkerDto } from './CreateWorker.dto';

export class UpdateWorkerDto extends CreateWorkerDto {
  @ApiProperty({ example: true, description: 'Флаг активності працівника' })
  @IsBoolean()
  active: boolean;
}
