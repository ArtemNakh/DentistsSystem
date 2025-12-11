import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DentistryModule } from './dentistry/dentistry.module';
import { ConfigModule } from '@nestjs/config';
import config from '../config';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),DentistryModule],
   
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
