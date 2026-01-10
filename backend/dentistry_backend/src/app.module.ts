import { Module } from '@nestjs/common';
import { DentistryModule } from './dentistry/dentistry.module';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyModule } from './specialty/specialty.module';
import { OperationListModule } from './operation-list/operation-list.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';

import { TokensModule } from './tokens/tokens.module';
import AppDataSource from './database/data-source';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { EmailModule } from './libs/email/email.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';
import { WorkersModule } from './workers/workers.module';
import { LicenseModule } from './license/license.module';

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
    AuthModule,
    EmailConfirmationModule,
    TokensModule,
    EmailModule,
    PasswordRecoveryModule,
    WorkersModule,
    LicenseModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
