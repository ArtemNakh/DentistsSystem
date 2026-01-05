import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { ClientService } from 'src/clients/clients.service';
import { EmailService } from 'src/libs/email/email.service';
import { Token } from 'src/tokens/entities/tokens.entity';
import { Client } from 'src/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Client])],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, ClientService, EmailService],
})
export class PasswordRecoveryModule {}
