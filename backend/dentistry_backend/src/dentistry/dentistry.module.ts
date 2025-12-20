// import { Module } from '@nestjs/common';
// import { DentistryService } from './dentistry.service';
// import { DentistryController } from './dentistry.controller';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { Dentistry } from './entities/dentistry.entity';

import { Module } from "@nestjs/common";

import { DentistryService } from "./dentistry.service";

import { Dentistry } from "./entities/dentistry.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DentistryController } from "./dentistry.controller";

// @Module({
//   imports:[SequelizeModule.forFeature([Dentistry])],
//   controllers: [DentistryController],
//   providers: [DentistryService],
// })
// export class DentistryModule {}



@Module({
    imports: [TypeOrmModule.forFeature([Dentistry])],
  providers: [DentistryService],
  controllers: [DentistryController],
})

export class DentistryModule{

}