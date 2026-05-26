import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWorkersByDentistryQuery {
  @ApiProperty({
    description: 'Ідентифікатор стоматології',
    example: 1,
    type: Number,
    required: true,
  })
  @Type(() => Number) 
  @IsInt({ message: 'dentistryId must be an integer number' })
  @IsPositive({ message: 'dentistryId must be a positive number' })
  dentistryId: number;
}
