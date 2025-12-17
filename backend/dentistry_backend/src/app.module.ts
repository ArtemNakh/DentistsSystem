import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DentistryModule } from './dentistry/dentistry.module';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dentistry } from './dentistry/entities/dentistry.entity';

@Module({
  //підключає модуль конфігурації,
  // робить його глобальним,
  // завантажує кастомну конфігурацію з функції config.
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    // https://docs.nestjs.com/recipes/sql-sequelize
    // i stoped on this words(Model injection#
    // In Sequelize the Model defines a table in the database. Instances of this class represent a database row. Firstly, we need at least one entity:))
    SequelizeModule.forRoot({
      dialect: process.env.DIALECT as any,
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      autoLoadModels: false,
      synchronize: false,
      models: [Dentistry],
    }),

    DentistryModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
