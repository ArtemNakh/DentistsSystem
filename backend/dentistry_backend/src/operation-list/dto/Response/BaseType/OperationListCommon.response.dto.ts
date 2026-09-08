import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OperationListCommonDto {
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор операції',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Видалення зуба',
    description: 'Назва операції',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Хірургічне видалення зуба мудрості',
    description: 'Опис операції',
    required: false,
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: 1200,
    description: 'Вартість операції у гривнях',
    type: Number,
  })
  @Expose()
  price: number;
}
