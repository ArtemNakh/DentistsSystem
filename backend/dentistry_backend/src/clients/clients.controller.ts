import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './clients.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { ClientAuthGuard } from '@/auth/guards/clientAuth.guard';
import { SearchClientsQueryDto } from './dto/Query/SearchClients.query.dto';
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
}
