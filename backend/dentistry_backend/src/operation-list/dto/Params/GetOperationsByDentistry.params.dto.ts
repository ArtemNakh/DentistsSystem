import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetOperationsByDentistryParamDto {
  @ApiProperty({
    description: 'dentistryId стоматології',
    example: 31,
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: 'dentistryId має бути числом' })
  @Min(1, { message: 'dentistryId має бути більше 0' })
  dentistryId: number;
}
