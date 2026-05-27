import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OperationListService } from './operation-list.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOperationDto } from './dto/CreateOperation-list.dto';
import { IOperationList } from './entities/operation-list.interface';
import { Authorization } from '../auth/decorators/Authorization.decorator';
import { WorkerAuthGuard } from '../auth/guards/workerAuth.guard';
import { SpecialtyType } from '../specialty/entities/specialty.interface';
import { IWorker } from '../workers/entities/workers.interface';
import { UpdateOperationParamDto } from './dto/Params/UpdateOperation.params.dto';
import { DeleteOperationParamDto } from './dto/Params/DeleteOperation.params.dto';
import { SearchOperationByDentistryQuery } from './dto/Query/SearchOperationByDentistry.param.dto';
import { CreateOperationListResponseDto } from './dto/Response/CreateOperationList.response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateOperationDto } from './dto/Update-Operation-list.dto';
import { UpdateOperationListResponseDto } from './dto/Response/UpdateOperationList.response.dto';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { SearchOperationListByDentistryResponseDto } from './dto/Response/SearchByDentistryOperationList.response.dto';
@ApiTags('Operation List')
@Controller('operation-list')
export class OperationListController {
  constructor(private readonly operationListService: OperationListService) {}

  @Post('create')
  @Authorization(SpecialtyType.ADMIN)
  @UseGuards(WorkerAuthGuard)
  @ApiOperation({ summary: 'Створити нову операцію' })
  @ApiBody({ type: CreateOperationDto })
  @ApiResponse({
    status: 201,
    description: 'Операцію успішно створено',
    type: CreateOperationListResponseDto,
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
  @ApiResponse({
    status: 409,
    description: 'Операція з такою назвою вже існує у цій стоматології',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Operation with name "Видалення зуба" already exists in this dentistry',
        },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async createOperation(
    @Body() dto: CreateOperationDto,
    @Authorized() worker: IWorker,
  ): Promise<CreateOperationListResponseDto> {
    const dentistry = worker.dentistry;
    const createdOperation = await this.operationListService.createOperation(
      dto,
      dentistry.id,
    );

    return plainToInstance(CreateOperationListResponseDto, createdOperation, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':operationId')
  @Authorization(SpecialtyType.ADMIN)
  @UseGuards(WorkerAuthGuard)
  @ApiOperation({ summary: 'Оновити операцію' })
  @ApiBody({ type: UpdateOperationDto })
  @ApiResponse({
    status: 200,
    description: 'Операцію успішно оновлено',
    type: CreateOperationListResponseDto,
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
  async updateOperation(
    @Param() params: UpdateOperationParamDto,
    @Body() dto: UpdateOperationDto,
  ): Promise<UpdateOperationListResponseDto> {
    const { operationId } = params;
    const updatedOperation = await this.operationListService.updateOperation(
      operationId,
      dto,
    );

    return plainToInstance(UpdateOperationListResponseDto, updatedOperation, {
      excludeExtraneousValues: true,
    });
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
    type: SearchOperationListByDentistryResponseDto,
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
    @Authorized() worker: IWorker,
  ): Promise<SearchOperationListByDentistryResponseDto[]> {
    const { search } = query;
    const dentistryId = worker.dentistry.id;
    const operationList = await this.operationListService.findByName(
      search,
      dentistryId,
    );
    return plainToInstance(
      SearchOperationListByDentistryResponseDto,
      operationList,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
