import { Module } from '@nestjs/common';
import { DentistryService } from './dentistry.service';
import { DentistryController } from './dentistry.controller';

@Module({
  controllers: [DentistryController],
  providers: [DentistryService],
})
export class DentistryModule {}
