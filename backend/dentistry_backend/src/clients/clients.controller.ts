import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { ClientService } from './clients.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { ClientAuthGuard } from '@/auth/guards/clientAuth.guard';
import { SearchClientsQueryDto } from './dto/Query/SearchClients.query.dto';
import { UpdateClientDto } from './dto/UpdateClient.dto';
import { IClient } from './entities/client.interface';
@ApiTags('Client')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientService) {}

  @Get('test/all')
  @ApiOperation({
    summary: 'Отримати всіх клієнтів',
    description:
      'Повертає список усіх клієнтів із бази даних, включно з основною інформацією про них.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список клієнтів успішно отримано',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Nathen' },
          surname: { type: 'string', example: 'Nader' },
          middle_name: { type: 'string', example: 'Marlowe' },
          birthdate: {
            type: 'string',
            format: 'date',
            example: '2007-12-25',
          },
          blood_resus: { type: 'string', example: 'minus' },
          blood_group: { type: 'number', example: 1 },
          phone: { type: 'string', example: '+380681978291' },
          allergic_diseases: {
            type: 'string',
            example: 'ex temporibus eligendi',
          },
          email: { type: 'string', example: 'cricetamarinus@gmail.com' },
          password: { type: 'string', example: 'a2BECurUH6' },
          isVerified: { type: 'boolean', example: false },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-08T15:20:33.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-14T15:20:20.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований доступ',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
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
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.RECEPTION)
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Отримати поточного клієнта',
    description:
      'Повертає дані авторизованого клієнта на основі його сесії. Якщо клієнт не авторизований або сесія відсутня — повертає помилку.',
  })
  @ApiResponse({
    status: 200,
    description: 'Дані клієнта успішно отримано',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Nathen' },
        surname: { type: 'string', example: 'Nader' },
        middle_name: { type: 'string', example: 'Marlowe' },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '2007-12-25',
        },
        blood_resus: { type: 'string', example: 'minus' },
        blood_group: { type: 'number', example: 1 },
        phone: { type: 'string', example: '+380681978291' },
        allergic_diseases: {
          type: 'string',
          example: 'ex temporibus eligendi',
        },
        email: { type: 'string', example: 'cricetamarinus@gmail.com' },
        password: { type: 'string', example: 'a2BECurUH6' },
        isVerified: { type: 'boolean', example: false },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-04-08T15:20:33.000Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-05-14T15:20:20.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований клієнт або відсутня сесія',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'No client session' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Клієнта не знайдено',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Client with id 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseGuards(ClientAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getCurrentClient(@Req() req: Request) {
    console.log('se', req.session);
    if (!req.session.clientId) {
      throw new UnauthorizedException('No client session');
    }
    const client = await this.clientsService.findById(
      Number(req.session.clientId),
    );
    return { ...client };
  }

  @Get('search')
  @ApiOperation({
    summary: 'Пошук клієнтів',
    description:
      'Повертає список клієнтів, які відповідають пошуковому рядку (ПІБ). Якщо параметр не передано — повертає всіх клієнтів.',
  })
  @ApiResponse({
    status: 200,
    description: 'Клієнти успішно знайдені',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Nathen' },
          surname: { type: 'string', example: 'Nader' },
          middle_name: { type: 'string', example: 'Marlowe' },
          birthdate: {
            type: 'string',
            format: 'date',
            example: '2007-12-25',
          },
          blood_resus: { type: 'string', example: 'minus' },
          blood_group: { type: 'number', example: 1 },
          phone: { type: 'string', example: '+380681978291' },
          allergic_diseases: {
            type: 'string',
            example: 'ex temporibus eligendi',
          },
          email: { type: 'string', example: 'cricetamarinus@gmail.com' },
          isVerified: { type: 'boolean', example: false },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-08T15:20:33.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-14T15:20:20.000Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['search має бути рядком'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований користувач',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized client' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Недостатньо прав ',
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
  async searchClients(@Query() query: SearchClientsQueryDto) {
    const { search } = query;
    return this.clientsService.findByFullName(search);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити дані клієнта' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Унікальний ідентифікатор клієнта',
    example: 12,
  })
  @ApiBody({
    type: UpdateClientDto,
    description: 'Payload для оновлення клієнта',
    examples: {
      valid: {
        summary: 'Валідне оновлення',
        value: {
          name: 'John',
          surname: 'Doe',
          middle_name: 'Michael',
          birthdate: '1990-05-15',
          blood_resus: 'plus',
          blood_group: 2,
          phone: '+1234567890',
          allergic_diseases: 'Pollen',
          email: 'john.doe@example.com',
        },
      },
      invalid: {
        summary: 'Невалідне оновлення',
        value: {
          name: '',
          surname: '',
          email: 'wrong-email',
          blood_group: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Клієнт успішно оновлений',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 12 },
        name: { type: 'string', example: 'John' },
        surname: { type: 'string', example: 'Doe' },
        middle_name: { type: 'string', example: 'Michael' },
        birthdate: { type: 'string', example: '1990-05-15' },
        blood_resus: { type: 'string', example: 'plus' },
        blood_group: { type: 'number', example: 2 },
        phone: { type: 'string', example: '+1234567890' },
        allergic_diseases: { type: 'string', example: 'Pollen' },
        email: { type: 'string', example: 'john.doe@example.com' },
        isVerified: { type: 'boolean', example: true },
        created_at: { type: 'string', example: '2024-01-01T12:00:00Z' },
        updated_at: { type: 'string', example: '2024-05-01T12:00:00Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'Name must be string',
            'Uncorrect format email',
            'Blood group must be between 1 and 4',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Клієнта не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Client with id 12 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Server Error' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Клієнт не авторизований',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Працівник не авторизований' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @UseGuards(ClientAuthGuard)
  async updateClient(
    @Param('id') id: number,
    @Body() dto: UpdateClientDto,
  ): Promise<IClient> {
    return this.clientsService.update(id, dto);
  }
}
