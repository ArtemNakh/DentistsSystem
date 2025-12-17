import { Module } from '@nestjs/common';
import { DentistryService } from './dentistry.service';
import { DentistryController } from './dentistry.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dentistry } from './entities/dentistry.entity';

@Module({
  imports:[SequelizeModule.forFeature([Dentistry])],
  controllers: [DentistryController],
  providers: [DentistryService],
})
export class DentistryModule {}
