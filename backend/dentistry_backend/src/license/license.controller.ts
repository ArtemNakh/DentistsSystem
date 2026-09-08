import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLicenseDto } from './dto/CreateLicense.dto';
import { UpdateLicenseDto } from './dto/UpdateLicense.dto';
import { Authorization } from '@/auth/decorators/Authorization.decorator';
import { SpecialtyType } from '@/specialty/entities/specialty.interface';
import { UpdateLicenseParamDto } from './dto/Params/UpdateLicense.param.dto';
import { RemoveLicenseParamDto } from './dto/Params/RemoveLicense.param.dto';
import { GetLicensesByDentistryParamDto } from './dto/Params/GetLicensesByDentistry.param.dto';
import { GetLicensesByWorkerParamDto } from './dto/Params/GetLicensesByWorker.param.dto';
import { GetExpiringLicensesWorkerQueryDto } from './dto/Query/GetExpiringLicensesWorker.query.dto';
import { GetExpiringLicensesDentistryQueryDto } from './dto/Query/GetExpiringLicensesDentistry.query.dto';
import { CreateLicenseResponseDto } from './dto/Response/CreateLicense.response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateLicenseResponseDto } from './dto/Response/UpdateLicense.response.dto';
import { GetLicensesByDentistryResponseDto } from './dto/Response/GetLicensesByDentistry.response.dto';
import { GetLicensesByWorkerResponseDto } from './dto/Response/GetLicensesByWorker.response.dto';
import { GetExpirationLicensesToWorkerResponseDto } from './dto/Response/GetExpirationLicensesToWorker.response.dto';
import { GetExpirationLicensesToDentistryResponseDto } from './dto/Response/GetExpirationLicensesToDentistry.response.dto';
import { GetLicensesByDentistryQueryDto } from './dto/Query/GetLicensesByDentistry.query.dto';

@ApiTags('License')
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Створити нову ліцензію',
    description:
      'Ендпоінт створює нову ліцензію для працівника на основі переданих даних.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    type: CreateLicenseDto,
    description: 'Payload для створення ліцензії',
    examples: {
      valid: {
        summary: 'Валідний запит',
        value: {
          workerId: 91,
          issue_date: '2026-03-17',
          issued_by: 'Міністерство охорони здоровʼя',
          number_license: 'LIC-2026-001',
          expiration_date: '2028-03-17',
        },
      },
      invalid: {
        summary: 'Невалідний запит',
        value: {
          workerId: null,
          issue_date: 'invalid-date',
          issued_by: '',
          number_license: '',
          expiration_date: 'wrong-format',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ліцензію успішно створено',
    type: CreateLicenseResponseDto,
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
            'workerId must be a number',
            'issue_date must be a valid ISO date string',
            'issued_by should not be empty',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Працівника не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Worker not found' },
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  async createLicense(
    @Body() dto: CreateLicenseDto,
  ): Promise<CreateLicenseResponseDto> {
    const newLicense = await this.licenseService.createLicense(dto);

    return plainToInstance(CreateLicenseResponseDto, newLicense, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити ліцензію' })
  @ApiBody({ type: UpdateLicenseDto })
  @ApiResponse({
    status: 200,
    description: 'Ліцензію успішно оновлено',
    type: UpdateLicenseResponseDto,
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
    description: 'Ліцензію не знайдено',
    schema: {
      example: {
        statusCode: 404,
        message: 'License with id 12 not found',
        error: 'Not Found',
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  async updateLicense(
    @Param() params: UpdateLicenseParamDto,
    @Body() dto: UpdateLicenseDto,
  ): Promise<UpdateLicenseResponseDto> {
    const updatedLicense = await this.licenseService.updateLicense(
      params.id,
      dto,
    );

    return plainToInstance(UpdateLicenseResponseDto, updatedLicense, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити ліцензію' })
  @ApiResponse({
    status: 200,
    description: 'Ліцензію успішно видалено',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'License successfully removed' },
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
    description: 'Ліцензію не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'License with id 12 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN)
  removeLicense(
    @Param() params: RemoveLicenseParamDto,
  ): Promise<{ success: boolean; message: string }> {
    const { id } = params;
    return this.licenseService.removeLicense(id);
  }

  @Get('dentistry/:dentistryId')
  @ApiOperation({
    summary: 'Отримати всі ліцензії для стоматології',
    description:
      'Ендпоінт повертає список ліцензій, які належать працівникам певної стоматології.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список ліцензій стоматології',
    type: GetLicensesByDentistryResponseDto,
    isArray: true,
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
    description: 'Стоматологію не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Dentistry with id 5 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization()
  async getLicensesByDentistry(
    @Param() params: GetLicensesByDentistryParamDto,
    @Query() query:GetLicensesByDentistryQueryDto
  ): Promise<GetLicensesByDentistryResponseDto[]> {
    const { dentistryId } = params;
    const {take,skip}=query
    const licenses =
      await this.licenseService.getLicensesByDentistry(dentistryId,take,skip);

    return plainToInstance(GetLicensesByDentistryResponseDto, licenses, {
      excludeExtraneousValues: true,
    });
  }

  @Get('worker/:workerId')
  @ApiOperation({
    summary: 'Отримати всі ліцензії працівника за його ID',
    description:
      'Ендпоінт повертає список ліцензій, які належать конкретному працівнику. Якщо працівника не знайдено — повертає помилку 404.',
  })
  @ApiResponse({
    status: 200,
    description: 'Ліцензії знайдено',
    type: GetLicensesByWorkerResponseDto,
    isArray: true,
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
    description: 'Працівника не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Працівника з id=91 не знайдено',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @Authorization()
  @UseInterceptors(ClassSerializerInterceptor)
  async getLicensesByWorkerId(
    @Param() params: GetLicensesByWorkerParamDto,
  ): Promise<GetLicensesByWorkerResponseDto[]> {
    const { workerId } = params;
    const workerLicenses =
      await this.licenseService.getLicensesByWorkerId(workerId);

    return plainToInstance(GetLicensesByWorkerResponseDto, workerLicenses, {
      excludeExtraneousValues: true,
    });
  }

  @Get('expiring-licenses-worker')
  @ApiOperation({
    summary: 'Отримати ліцензії лікаря, що закінчуються',
    description:
      'Ендпоінт повертає список ліцензій для конкретного лікаря, у яких термін дії закінчується протягом заданої кількості днів.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список ліцензій лікаря',
    type: GetExpirationLicensesToWorkerResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні параметри запиту',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'workerId та maxDays є обовʼязковими параметрами',
        },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Лікаря не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Worker with id 5 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Authorization(SpecialtyType.ADMIN, SpecialtyType.DOCTOR)
  async getExpiringLicenses(
    @Query() query: GetExpiringLicensesWorkerQueryDto,
  ): Promise<GetExpirationLicensesToWorkerResponseDto[]> {
    const { workerId, maxDays } = query;
    if (!workerId || !maxDays) {
      throw new BadRequestException(
        'workerId та maxDays є обовʼязковими параметрами',
      );
    }

    const expirationLicenses =
      await this.licenseService.findExpiringLicensesByWorker(workerId, maxDays);

    return plainToInstance(
      GetExpirationLicensesToWorkerResponseDto,
      expirationLicenses,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Get('expiring-licenses-dentistry')
  @ApiOperation({
    summary: 'Отримати ліцензії стоматології, що закінчуються',
    description:
      'Ендпоінт повертає всі ліцензії лікарів у конкретній стоматології, термін дії яких закінчується протягом заданої кількості днів.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список ліцензій стоматології',
    type: GetExpirationLicensesToDentistryResponseDto,isArray:true
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні параметри (dentistryId або maxDays відсутні)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'dentistryId та maxDays є обовʼязковими параметрами',
        },
        error: { type: 'string', example: 'Bad Request' },
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
    description: 'Стоматологію не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Dentistry with id 3 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @Authorization(SpecialtyType.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async getExpiringLicensesByDentistry(
    @Query() query: GetExpiringLicensesDentistryQueryDto,
  ): Promise<GetExpirationLicensesToDentistryResponseDto[]> {
    const { dentistryId, maxDays } = query;
    if (!dentistryId || !maxDays) {
      throw new BadRequestException(
        'dentistryId та maxDays є обовʼязковими параметрами',
      );
    }

    const expirationLicenses =
      await this.licenseService.findExpiringLicensesByDentistry(
        dentistryId,
        maxDays,
      );

    return plainToInstance(
      GetExpirationLicensesToDentistryResponseDto,
      expirationLicenses,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
