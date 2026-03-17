import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: ["dentistryId must be a number conforming to the specified constraints"] })
  message: string[];

  @ApiProperty({ example: "Bad Request" })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
