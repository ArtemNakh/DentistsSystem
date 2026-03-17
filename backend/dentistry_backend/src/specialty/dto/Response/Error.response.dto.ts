import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: ["type must be one of the following values: doctor, admin, reception"],
    description: 'Список повідомлень про помилки валідації'
  })
  message: string[];

  @ApiProperty({ example: "Bad Request", description: 'Тип помилки' })
  error: string;

  @ApiProperty({ example: 400, description: 'HTTP статус код' })
  statusCode: number;
}
