import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Client]),forwardRef(() => EmailConfirmationModule)], // 👈 додає репозиторій для Client ],
  controllers: [AuthController],
  providers: [AuthService, ClientService],
  exports: [AuthService],
})
export class AuthModule {}
