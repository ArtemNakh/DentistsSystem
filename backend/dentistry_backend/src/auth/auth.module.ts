import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Client } from '@/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { WorkersModule } from '@/workers/workers.module';
import { ClientsModule } from '@/clients/clients.module';

@Module({
  imports: [ClientsModule, WorkersModule,TypeOrmModule.forFeature([Client]),forwardRef(() => EmailConfirmationModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
