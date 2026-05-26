import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWorkerBodyDto } from './CreateWorker.dto';
import { Type } from 'class-transformer';

export class UpdateWorkerDto extends PartialType(CreateWorkerBodyDto) {
  @ApiProperty({ example: true, description: 'Флаг активності працівника' })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  active?: boolean;
}
