import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
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
import { OperationList } from './entities/operation-list.entity';
import { OperationResponseDto } from './dto/Response/CreateOperation-list.response.dto';
import { IOperationList } from './entities/operation-list.interface';
import { WorkerAuthGuard } from 'src/auth/guards/workerAuth.guard';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Worker } from 'src/workers/entities/workers.entity';
import { IWorker } from 'src/workers/entities/workers.interface';
import { SpecialtyType } from 'src/specialty/entities/specialty.interface';
import { Authorization } from 'src/auth/decorators/auth.decorator';
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
  @UseGuards(WorkerAuthGuard) // ✅ лише авторизовані працівники
  @ApiOperation({ summary: 'Створити нову операцію' })
  @ApiBody({ type: CreateOperationDto })
  @ApiResponse({
    status: 201,
    description: 'Операцію успішно створено',
    type: OperationResponseDto,
  })
  createOperation(
    @Body() dto: CreateOperationDto,
    @Req() req,
    @Authorized() worker: IWorker, // отримуємо працівника з guard
  ): Promise<IOperationList> {
    const dentistry = worker.dentistry; // беремо з авторизованого працівника
    return this.operationListService.createOperation(dto, dentistry.id);
  }

  @Put(':id')
  @Authorization(SpecialtyType.ADMIN)
  @UseGuards(WorkerAuthGuard) // ✅ лише авторизовані працівники
  @ApiOperation({ summary: 'Оновити операцію' })
  @ApiParam({ name: 'id', description: 'ID операції', type: Number })
  @ApiBody({ type: UpdateOperationDto })
  @ApiResponse({
    status: 200,
    description: 'Операцію успішно оновлено',
    type: OperationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Операцію не знайдено' })
  updateOperation(
    @Param('id') id: number,
    @Body() dto: UpdateOperationDto,
    @Authorized() worker: Worker, // отримуємо працівника з guard
  ): Promise<IOperationList> {
    return this.operationListService.updateOperation(id, dto);
  }

  @Delete(':id')
  @Authorization(SpecialtyType.ADMIN)
  @ApiOperation({ summary: 'Видалити операцію' })
  @ApiParam({ name: 'id', description: 'ID операції', type: Number })
  @ApiResponse({ status: 200, description: 'Операцію успішно видалено' })
  @ApiResponse({ status: 404, description: 'Операцію не знайдено' })
  removeOperation(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.operationListService.removeOperation(id);
  }
}
