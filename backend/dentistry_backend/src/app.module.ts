import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DentistryModule } from './dentistry/dentistry.module';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.MYSQL_HOST || 'localhost',
    //   port: Number(process.env.MYSQL_PORT) || 3306,
    //   username: process.env.MYSQL_USER || 'root',
    //   password: process.env.MYSQL_PASSWORD || '',
    //   database: process.env.MYSQL_DB || 'test',
    //   autoLoadEntities: true,
    //   synchronize: false,
    // }),
    
 TypeOrmModule.forRoot(AppDataSource.options),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.MYSQL_HOST || 'localhost',
    //   port: Number(process.env.MYSQL_PORT) || 3306,
    //   username: process.env.MYSQL_USER || 'root',
    //   password: process.env.MYSQL_PASSWORD || '',
    //   database: process.env.MYSQL_DB || 'test',
    //   autoLoadEntities: true,
    //   synchronize: false,

    //   migrations: [__dirname + '/migration/**/*{.js,.ts}'],
    //   migrationsRun: false,//автоматично запускати міграції під час кожного запуску програми
   
    // }),

    DentistryModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
