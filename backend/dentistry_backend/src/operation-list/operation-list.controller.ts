import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OperationListService } from './operation-list.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateOperationDto,
  UpdateOperationDto,
} from './dto/CreateOperation-list.dto';
import { OperationResponseDto } from './dto/Response/CreateOperation-list.response.dto';
import { IOperationList } from './entities/operation-list.interface';
import { Authorization } from '../auth/decorators/Authorization.decorator';
import { WorkerAuthGuard } from '../auth/guards/workerAuth.guard';
import { SpecialtyType } from '../specialty/entities/specialty.interface';
import { IWorker } from '../workers/entities/workers.interface';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { Worker } from '@/workers/entities/workers.entity';
import { UpdateOperationParamDto } from './dto/Params/UpdateOperation.params.dto';
import { DeleteOperationParamDto } from './dto/Params/DeleteOperation.params.dto';
import { SearchOperationByDentistryQuery } from './dto/Query/SearchOperationByDentistry.param.dto';
@ApiTags('Operation List')
@Controller('operation-list')
export class OperationListController {
  constructor(private readonly operationListService: OperationListService) {}

  @Get('test/all')
  findAll() {
    return this.operationListService.findAll();
  }

  @Post('create')
  @Authorization(SpecialtyType.ADMIN)
  @UseGuards(WorkerAuthGuard)
  @ApiOperation({ summary: 'Створити нову операцію' })
  @ApiBody({ type: CreateOperationDto })
  @ApiResponse({
    status: 201,
    description: 'Операцію успішно створено',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 31 },
        name: { type: 'string', example: 'Видалення зуба' },
        description: { type: 'string', example: 'Хірургічне видалення зуба' },
        price: { type: 'number', example: 1500 },
        active: { type: 'boolean', example: true },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-05-21T15:59:03.000Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-05-21T15:59:03.000Z',
        },
        dental_clinic: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            street: { type: 'string', example: '55438 Heaney Island' },
            city: { type: 'string', example: 'Beckerworth' },
            region: { type: 'string', example: 'Florida' },
            is_active: { type: 'boolean', example: true },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-08T15:20:33.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-08T15:20:33.000Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
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
  @ApiResponse({
    status: 404,
    description: 'appointment не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
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
          example: [
            'name must be a string',
            'description must be a string',
            'price must be a number conforming to the specified constraints',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  createOperation(
    @Body() dto: CreateOperationDto,
    @Authorized() worker: IWorker,
  ): Promise<IOperationList> {
    const dentistry = worker.dentistry;
    return this.operationListService.createOperation(dto, dentistry.id);
  }

  @Put(':id')
  @Authorization(SpecialtyType.ADMIN)
  @UseGuards(WorkerAuthGuard)
  @ApiOperation({ summary: 'Оновити операцію' })
  @ApiParam({ name: 'id', description: 'ID операції', type: Number })
  @ApiBody({ type: UpdateOperationDto })
  @ApiResponse({
    status: 200,
    description: 'Операцію успішно оновлено',
    type: OperationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
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
  @ApiResponse({
    status: 404,
    description: 'operation не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
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
          example: [
            'name must be a string',
            'description must be a string',
            'price must be a number conforming to the specified constraints',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  updateOperation(
    @Param() params: UpdateOperationParamDto,
    @Body() dto: UpdateOperationDto,
  ): Promise<IOperationList> {
    const { operaitonId } = params;
    return this.operationListService.updateOperation(operaitonId, dto);
  }

  @Delete(':operationId')
  @ApiOperation({ summary: 'Видалити операцію' })
  @ApiResponse({
    status: 200,
    description: 'Операцію успішно деактивовано',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Operation with id 31 has been deactivated',
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
          example: [
            'name must be a string',
            'description must be a string',
            'price must be a number conforming to the specified constraints',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
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
  @ApiResponse({
    status: 404,
    description: 'operation не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @Authorization(SpecialtyType.ADMIN)
  @ApiOperation({ summary: 'Видалити операцію' })
  @UseInterceptors(ClassSerializerInterceptor)
  removeOperation(
    @Param() params: DeleteOperationParamDto,
  ): Promise<{ success: boolean; message: string }> {
    const { operationId } = params;
    return this.operationListService.removeOperation(operationId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Пошук операцій у стоматології',
    description:
      'Повертає список операцій для вибраної стоматології за її ID з можливістю пошуку за назвою.',
  })
  @ApiResponse({
    status: 200,
    description: 'Операції отримано успішно',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Intelligent Plastic Salad' },
          description: {
            type: 'string',
            example:
              "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
          },
          price: { type: 'number', example: 269 },
          active: { type: 'boolean', example: true },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-08T15:20:33.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-08T15:20:33.000Z',
          },
          dental_clinic: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              street: { type: 'string', example: '55438 Heaney Island' },
              city: { type: 'string', example: 'Beckerworth' },
              region: { type: 'string', example: 'Florida' },
              is_active: { type: 'boolean', example: true },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-08T15:20:33.000Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2026-04-08T15:20:33.000Z',
              },
            },
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
          example: [
            'name must be a string',
            'description must be a string',
            'price must be a number conforming to the specified constraints',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
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
  @ApiResponse({
    status: 404,
    description: 'dentistry не знайдена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Worker with id 12323 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  async searchOperations(
    @Query() query: SearchOperationByDentistryQuery,
  ): Promise<IOperationList[]> {
    const { dentistryId, search } = query;
    return this.operationListService.findByName(search, dentistryId);
  }
}
