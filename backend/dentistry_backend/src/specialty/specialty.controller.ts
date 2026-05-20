import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { Request } from 'express';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSpecialtyDto } from './dto/CreateSpecialty.dto';
import { SpecialtyResponseDto } from './dto/Response/CreateSpecialty.response.dto';
import { Specialty } from './entities/specialty.entity';
import { UpdateSpecialtyDto } from './dto/UpdateSpecialty.dto';
import { ErrorSpecialtyResponseDto } from './dto/Response/Error.response.dto';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { SpecialtyType } from './entities/specialty.interface';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get('test/specialt/all')
  findAll() {
    return this.specialtyService.findAll();
  }

  @Post('create')
  @ApiOperation({
    summary: 'Створити нову спеціалізацію',
    description:
      'Створює нову спеціалізацію для працівників стоматології. Потрібно передати назву, тип та (опційно) опис.',
  })
  @ApiBody({
    description: 'Дані для створення спеціалізації',
    type: CreateSpecialtyDto,
    examples: {
      valid: {
        summary: 'Приклад',
        value: {
          name: 'Хірург',
          description: 'Оперативне лікування зубів',
          type: 'doctor',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Спеціалізацію успішно створено',
    type: SpecialtyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані або невалідний JSON',
    schema: {
      type: 'object',
      properties: {
        message: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'string' },
              example: [
                'type must be one of the following values: doctor, admin, reception',
              ],
            },
            {
              type: 'string',
              example:
                'Unexpected token \'a\', ..."type": invlid\n}" is not valid JSON',
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Спеціалізація з такою назвою вже існує',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Specialty with name "Хірург" already exists',
        },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Користувач не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав для пошуку стоматологій',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  CreateSpecialty(@Body() dto: CreateSpecialtyDto): Promise<Specialty> {
    return this.specialtyService.CreateSpecialty(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Оновити спеціалізацію',
    description:
      'Оновлює дані спеціалізації за ID. Можна змінити назву, опис та тип спеціалізації.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID спеціалізації',
    type: Number,
    example: 3,
  })
  @ApiBody({
    description: 'Дані для оновлення спеціалізації',
    type: UpdateSpecialtyDto,
    examples: {
      valid: {
        summary: 'Коректний приклад',
        value: {
          name: 'Ортодонт',
          description: 'Виправлення прикусу',
          type: 'doctor',
        },
      },
      onlyName: {
        summary: 'Оновлення лише назви',
        value: {
          name: 'Терапевт',
        },
      },
      invalidType: {
        summary: 'Некоректний тип',
        value: {
          type: 'invalid_type',
        },
      },
      emptyPayload: {
        summary: 'Порожній запит',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Спеціалізацію успішно оновлено',
    type: SpecialtyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для оновлення',
    schema: {
      type: 'object',
      properties: {
        message: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'string' },
              example: [
                'type must be one of the following values: doctor, admin, reception',
              ],
            },
            {
              type: 'string',
              example:
                'Unexpected token \'a\', ..."type": invlid\n}" is not valid JSON',
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Спеціалізацію не знайдено',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Specialty with id 5 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Спеціалізація з такою назвою вже існує',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Specialty with name "Хірург" already exists',
        },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  UpdateSpecialty(
    @Param('id') id: number,
    @Body() dto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtyService.UpdateSpecialty(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Видалити спеціалізацію (лише якщо не використовується)',
    description:
      'Видаляє спеціалізацію за ID. Якщо спеціалізація використовується працівниками — видалення заборонено.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID спеціалізації',
    type: Number,
    example: 4,
  })
  @ApiResponse({
    status: 200,
    description: 'Спеціалізацію успішно видалено',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Specialty deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Спеціалізацію неможливо видалити, бо вона використовується',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Cannot delete specialty because it is used by workers',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Спеціалізацію не знайдено',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Specialty with id 4 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Користувач не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав для пошуку стоматологій',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Недостатньо прав. Ваша професія (Global Operations Administrator) типу (doctor) не має доступу',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  RemoveSpecialty(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.specialtyService.RemoveSpecialty(id);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Пошук спеціалізацій за назвою',
    description:
      'Повертає список спеціалізацій, які належать працівникам певної стоматології. Якщо параметр search не передано — повертає всі спеціалізації стоматології.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Рядок для пошуку за назвою спеціалізації',
    examples: {
      full: {
        summary: 'Пошук за частиною назви',
        value: 'хіру',
      },
      empty: {
        summary: 'Порожній пошук — повертає всі спеціалізації',
        value: '',
      },
    },
  })
  @ApiQuery({
    name: 'dentistry',
    required: true,
    type: Number,
    description: 'ID стоматології',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Список знайдених спеціалізацій',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/SpecialtyResponseDto',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні параметри пошуку',
    schema: {
      type: 'object',
      properties: {
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Dentistry ID must be a valid number',
            },
            {
              type: 'string',
              example: 'Search parameter must contain at least 2 characters',
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Стоматологію не знайдено',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dentistry with id 3 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
    @UseInterceptors(ClassSerializerInterceptor)
  async searchWorkers(
    @Query('search') search: string,
    @Query('dentistry') dentistry: number,
  ) {
    return this.specialtyService.findByFullName(search, dentistry);
  }
}
