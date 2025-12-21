import { Module } from '@nestjs/common';
import { DentistryModule } from './dentistry/dentistry.module';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyModule } from './specialty/specialty.module';
import { OperationListModule } from './operation-list/operation-list.module';
import { ClientsModule } from './clients/clients.module';
import AppDataSource from './database/data-source';

@Module({
  imports: [
    //підключає модуль конфігурації,
    // робить його глобальним,
    // завантажує кастомну конфігурацію з функції config.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    TypeOrmModule.forRoot(AppDataSource.options),

    DentistryModule,
    SpecialtyModule,
    OperationListModule,
    ClientsModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
