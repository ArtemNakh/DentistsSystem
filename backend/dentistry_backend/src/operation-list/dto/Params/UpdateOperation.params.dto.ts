import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class UpdateOperationParamDto {
  @ApiProperty({
    description: 'ID операції',
    example: 31,
    type: Number,
  })
  @Type(() => Number)
  @IsInt({ message: 'operationId має бути числом' })
  @Min(1, { message: 'operationId має бути більше 0' })
  operationId: number;
}
