import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLicenseDto } from './dto/CreateLicense.dto';
import { LicenseResponseDto } from './dto/Response/CreateLicense.response.dto';
import { License } from './entities/license.entity';
import { ILicense } from './entities/license.interface';
import { UpdateLicenseDto } from './dto/UpdateLicense.dto';

@ApiTags('License')
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get('test/all')
  findAll() {
    return this.licenseService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Створити нову ліцензію' })
  @ApiBody({ type: CreateLicenseDto })
  @ApiResponse({
    status: 201,
    description: 'Ліцензію успішно створено',
    type: LicenseResponseDto,
  })
  createLicense(@Body() dto: CreateLicenseDto): Promise<ILicense> {
    return this.licenseService.createLicense(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити ліцензію' })
  @ApiParam({ name: 'id', description: 'ID ліцензії', type: Number })
  @ApiBody({ type: UpdateLicenseDto })
  @ApiResponse({
    status: 200,
    description: 'Ліцензію успішно оновлено',
    type: LicenseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ліцензію не знайдено' })
  updateLicense(
    @Param('id') id: number,
    @Body() dto: UpdateLicenseDto,
  ): Promise<ILicense> {
    return this.licenseService.updateLicense(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити ліцензію' })
  @ApiParam({ name: 'id', description: 'ID ліцензії', type: Number })
  @ApiResponse({ status: 200, description: 'Ліцензію успішно видалено' })
  @ApiResponse({ status: 404, description: 'Ліцензію не знайдено' })
  removeLicense(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.licenseService.removeLicense(id);
  }

  @Get('dentistry/:dentistryId')
  @ApiOperation({ summary: 'Отримати всі ліцензії для стоматології' })
  @ApiParam({
    name: 'dentistryId',
    description: 'ID стоматології',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Список ліцензій стоматології' })
  async getLicensesByDentistry(@Param('dentistryId') dentistryId: number) {
    return this.licenseService.getLicensesByDentistry(dentistryId);
  }

  @Get('worker/:workerId')
  @ApiOperation({ summary: 'Отримати всі ліцензії працівника за його ID' })
  @ApiParam({ name: 'workerId', description: 'ID працівника', type: Number })
  @ApiResponse({ status: 200, description: 'Ліцензії знайдено' })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  async getLicensesByWorkerId(
    @Param('workerId') workerId: number,
  ): Promise<License[]> {
    return this.licenseService.getLicensesByWorkerId(workerId);
  }


  @Get('expiring-licenses-worker')
   @ApiOperation({
    summary: 'Отримати ліцензії лікаря, що закінчуються',
    description: `Повертає список ліцензій для конкретного лікаря, у яких термін дії закінчується протягом заданої кількості днів.`,
  })
  @ApiQuery({
    name: 'workerId',
    required: true,
    type: Number,
    example: 5,
    description: 'ID лікаря (обовʼязковий параметр)',
  })
  @ApiQuery({
    name: 'maxDays',
    required: true,
    type: Number,
    example: 30,
    description: 'Максимальний діапазон у днях (обовʼязковий параметр)',
  })
  async getExpiringLicenses(
    @Query('workerId', ParseIntPipe) workerId: number,
    @Query('maxDays', ParseIntPipe) maxDays: number,
  ): Promise<ILicense[]> {
    if (!workerId || !maxDays) {
      throw new BadRequestException(
        'workerId та maxDays є обовʼязковими параметрами',
      );
    }

    return this.licenseService.findExpiringLicensesByWorker(workerId, maxDays);
  }


  @Get('expiring-licenses-dentistry')
  @ApiOperation({
    summary: 'Отримати ліцензії стоматології, що закінчуються',
    description:
      'Повертає всі ліцензії лікарів у конкретній стоматології, термін дії яких закінчується протягом заданої кількості днів.',
  })
  @ApiQuery({
    name: 'dentistryId',
    required: true,
    type: Number,
    example: 3,
    description: 'ID стоматології (обовʼязковий параметр)',
  })
  @ApiQuery({
    name: 'maxDays',
    required: true,
    type: Number,
    example: 30,
    description: 'Максимальний діапазон у днях (обовʼязковий параметр)',
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні параметри (dentistryId або maxDays відсутні)',
  })
  async getExpiringLicensesByDentistry(
    @Query('dentistryId', ParseIntPipe) dentistryId: number,
    @Query('maxDays', ParseIntPipe) maxDays: number,
  ): Promise<ILicense[]> {
    if (!dentistryId || !maxDays) {
      throw new BadRequestException(
        'dentistryId та maxDays є обовʼязковими параметрами',
      );
    }

    return this.licenseService.findExpiringLicensesByDentistry(
      dentistryId,
      maxDays,
    );
  }
}
