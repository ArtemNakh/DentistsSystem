import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class UpdateSpecialtyParamsDto {
  @ApiProperty({
    example: 5,
    description: 'Унікальний ідентифікатор спеціалізації, яку потрібно оновити',
  })
  @IsInt({ message: 'specialtyId має бути цілим числом' })
  @Min(1, { message: 'specialtyId має бути більше 0' })
  specialtyId: number;
}
