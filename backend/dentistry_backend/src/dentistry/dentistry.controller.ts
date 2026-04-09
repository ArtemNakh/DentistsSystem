import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { DentistryService } from './dentistry.service';

@ApiTags("Dental_clinics")
@Controller('dental_clinics')
export class DentistryController {
  constructor(private readonly dentistryService: DentistryService) {}

  @Get("test/all")
  GetAllValue(){
    return this.dentistryService.findAll();
  }
  
 @Get("search")
  async searchDentistries(@Query("search") city: string) {
    console.log("quest",city)
    return this.dentistryService.findByCity(city);
  }


  // @Post()
  // create(@Body() createDentistryDto: CreateDentistryDto) {
  //   return this.dentistryService.create(createDentistryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.dentistryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dentistryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDentistryDto: UpdateDentistryDto) {
  //   return this.dentistryService.update(+id, updateDentistryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dentistryService.remove(+id);
  // }
}
