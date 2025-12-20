import { Controller, Get } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Specialties")
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}


  @Get('test/specialt/all')
  findAll() {
    return this.specialtyService.findAll();
  }

}
