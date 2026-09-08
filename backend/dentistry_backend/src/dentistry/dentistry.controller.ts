import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DentistryService } from './dentistry.service';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SearchDentistryQueryDto } from './dto/Query/SearchDentistriesByCity.query.dto';
import { CreateDentistryDto } from './dto/create-dentistry.dto';
import { UpdateDentistryDto } from './dto/update-dentistry.dto';
import { UpdateDentistryStatusDto } from './dto/update-dentistry-status.dto';
import { plainToInstance } from 'class-transformer';
import { SearchDentistriesResponseDto } from './dto/Response/SearchDentistries.response.dto';
import { CreateDentistryResponseDto } from './dto/Response/CreatedDentistry.response.dto';
import { UpdateDentistryResponseDto } from './dto/Response/UpdateDentistry.response.dto';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';

@ApiTags('Dental_clinics')
@Controller('dental_clinics')
export class DentistryController {
  constructor(private readonly dentistryService: DentistryService) {}

  @Get('search')
  @ApiOperation({ summary: 'Пошук стоматологій за містом' })
  @ApiOkResponse({
    description: 'Список знайдених стоматологій',
    type: SearchDentistriesResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для пошуку',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['search must be a string'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
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
  async searchDentistries(
    @Query() query: SearchDentistryQueryDto,
  ): Promise<SearchDentistriesResponseDto[]> {
    const { city } = query;
    const findedDentistries = await this.dentistryService.findByCity(city);

    return plainToInstance(SearchDentistriesResponseDto, findedDentistries, {
      excludeExtraneousValues: true,
    });
  }

  @Post('create')
  @ApiOperation({
    summary: 'Створення стоматології',
    description: 'Створює новий запис стоматологічної клініки.',
  })
  @ApiBody({
    type: CreateDentistryDto,
    examples: {
      example1: {
        summary: 'Приклад створення',
        value: {
          street: 'Main Street 12',
          city: 'Berlin',
          region: 'Mitte',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Стоматологія успішно створена.',
    type: CreateDentistryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для створення',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['city should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
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
  @Authorization(SpecialtyType.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() dto: CreateDentistryDto,
  ): Promise<CreateDentistryResponseDto> {
    const createdDentistry = await this.dentistryService.create(dto);

    return plainToInstance(CreateDentistryResponseDto, createdDentistry, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Оновлення стоматології',
    description: 'Оновлює дані стоматологічної клініки за ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Ідентифікатор стоматології',
  })
  @ApiBody({
    type: UpdateDentistryDto,
    examples: {
      example1: {
        summary: 'Оновлення міста, вулиці, регіону',
        value: {
          street: 'Updated Street 55',
          city: 'Hamburg',
          region: 'Utah',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Стоматологія успішно оновлена.',
    type: UpdateDentistryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Клініку не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Clinic with id 8 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
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
  @Authorization(SpecialtyType.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDentistryDto,
  ): Promise<UpdateDentistryResponseDto> {
    const updatedDentistry = await this.dentistryService.update(id, dto);

    return plainToInstance(UpdateDentistryResponseDto, updatedDentistry, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('update/:id/status')
  @ApiOperation({
    summary: 'Зміна статусу стоматології',
    description:
      'Активує або деактивує стоматологію (soft delete через isActive).',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Ідентифікатор стоматології',
  })
  @ApiBody({
    type: UpdateDentistryStatusDto,
    examples: {
      deactivate: {
        summary: 'Деактивація',
        value: { isActive: false },
      },
      activate: {
        summary: 'Активація',
        value: { isActive: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Статус успішно змінено.',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний JSON у тілі запиту',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Unexpected token \'a\', ..."isActve": alse\n}" is not valid JSON',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Клініку не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Clinic with id 8 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
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
  @Authorization()
  @UseInterceptors(ClassSerializerInterceptor)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDentistryStatusDto,
  ): Promise<void> {
    return this.dentistryService.updateStatus(id, dto);
  }
}
