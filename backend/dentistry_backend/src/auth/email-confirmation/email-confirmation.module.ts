import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';

import { AuthModule } from '../auth.module';
import { EmailModule } from '@/libs/email/email.module';
import { Client } from '@/clients/entities/client.entity';
import { Token } from '@/tokens/entities/tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@/clients/clients.module';

@Module({
  imports: [
    EmailModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Token, Client]),
    ClientsModule,
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
