import { Module } from '@nestjs/common';
import { ClientService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { WorkersModule } from '@/workers/workers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), WorkersModule],
  controllers: [ClientsController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientsModule {}
