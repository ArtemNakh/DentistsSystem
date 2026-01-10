import { Controller, Get } from '@nestjs/common';
import { LicenseService } from './license.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('License')
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}
  
  @Get('test/all')
  findAll() {
    return this.licenseService.findAll();
  }
}
