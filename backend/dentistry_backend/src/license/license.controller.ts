import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LicenseService } from './license.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, description: 'Ліцензію успішно створено', type: LicenseResponseDto })
  createLicense(@Body() dto: CreateLicenseDto): Promise<ILicense> {
    return this.licenseService.createLicense(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити ліцензію' })
  @ApiParam({ name: 'id', description: 'ID ліцензії', type: Number })
  @ApiBody({ type: UpdateLicenseDto })
  @ApiResponse({ status: 200, description: 'Ліцензію успішно оновлено', type: LicenseResponseDto })
  @ApiResponse({ status: 404, description: 'Ліцензію не знайдено' })
  updateLicense(@Param('id') id: number, @Body() dto: UpdateLicenseDto): Promise<ILicense> {
    return this.licenseService.updateLicense(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити ліцензію' })
  @ApiParam({ name: 'id', description: 'ID ліцензії', type: Number })
  @ApiResponse({ status: 200, description: 'Ліцензію успішно видалено' })
  @ApiResponse({ status: 404, description: 'Ліцензію не знайдено' })
  removeLicense(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    return this.licenseService.removeLicense(id);
  }
}
