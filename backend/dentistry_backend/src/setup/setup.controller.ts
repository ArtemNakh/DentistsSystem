import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetupService } from './setup.service';

@ApiTags('Setup')
@Controller('Setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post('CreateDefaultUser')
  @ApiOperation({ summary: 'Створення базового працівника ' })
  @ApiResponse({
    status: 201,
    description: 'Базовий працівник успішно створений',
  })
  @ApiResponse({
    status: 200,
    description: 'Базовий працівник вже існує',
  })
  @ApiResponse({
    status: 400,
    description: 'Помилка при створенні базового працівника',
  })
  async createDefaultWorker(): Promise<void> {
    await this.setupService.CreateDefaultUser();
  }

  @Post('RemoveDefatulUser')
  @ApiOperation({ summary: 'Видалення базового працівника ' })
  @ApiResponse({
    status: 200,
    description: 'Базовий працівник успішно видалений',
  })
  @ApiResponse({
    status: 404,
    description: 'Базовий працівник не знайдений',
  })
  @ApiResponse({
    status: 400,
    description: 'Помилка при видаленні базового працівника',
  })
  async removeDefaultWorker(): Promise<void> {
    await this.setupService.RemoveDefaultUser();
  }
}
