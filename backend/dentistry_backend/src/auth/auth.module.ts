import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { WorkersModule } from 'src/workers/workers.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [ClientsModule, WorkersModule,TypeOrmModule.forFeature([Client]),forwardRef(() => EmailConfirmationModule)],
  controllers: [AuthController],
  providers: [AuthService, ClientService],
  exports: [AuthService],
})
export class AuthModule {}
