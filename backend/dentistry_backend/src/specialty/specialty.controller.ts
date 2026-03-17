import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSpecialtyDto } from './dto/CreateSpecialty.dto';
import { SpecialtyResponseDto } from './dto/Response/CreateSpecialty.response.dto';
import { Specialty } from './entities/specialty.entity';
import { UpdateSpecialtyDto } from './dto/UpdateSpecialty.dto';
import { ErrorResponseDto } from './dto/Response/Error.response.dto';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get('test/specialt/all')
  findAll() {
    return this.specialtyService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Створити нову спеціалізацію' })
  @ApiBody({ type: CreateSpecialtyDto })
  @ApiResponse({
    status: 201,
    description: 'Спеціалізацію успішно створено',
    type: SpecialtyResponseDto,
  })
  CreateSpecialty(@Body() dto: CreateSpecialtyDto): Promise<Specialty> {
    return this.specialtyService.CreateSpecialty(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити спеціалізацію' })
  @ApiParam({ name: 'id', description: 'ID спеціалізації', type: Number })
  @ApiBody({ type: UpdateSpecialtyDto })
  @ApiResponse({
    status: 200,
    description: 'Спеціалізацію успішно оновлено',
    type: SpecialtyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані для оновлення',
    type: ErrorResponseDto,
  })
  UpdateSpecialty(
    @Param('id') id: number,
    @Body() dto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    return this.specialtyService.UpdateSpecialty(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Видалити спеціалізацію (лише якщо не використовується)',
  })
  @ApiParam({ name: 'id', description: 'ID спеціалізації', type: Number })
  @ApiResponse({ status: 200, description: 'Спеціалізацію успішно видалено' })
  @ApiResponse({
    status: 400,
    description: 'Спеціалізацію неможливо видалити, бо вона використовується',
  })
  @ApiResponse({ status: 404, description: 'Спеціалізацію не знайдено' })
  RemoveSpecialty(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.specialtyService.RemoveSpecialty(id);
  }
}
