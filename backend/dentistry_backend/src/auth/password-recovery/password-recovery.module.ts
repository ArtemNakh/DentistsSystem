import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { ClientService } from '@/clients/clients.service';
import { EmailService } from '@/libs/email/email.service';
import { Token } from '@/tokens/entities/tokens.entity';
import { Client } from '@/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Client])],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, ClientService, EmailService],
})
export class PasswordRecoveryModule {}
