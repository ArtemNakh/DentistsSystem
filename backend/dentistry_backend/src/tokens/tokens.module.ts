import { Module } from '@nestjs/common';
import { Token } from './entities/tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [],
  exports: [TypeOrmModule],
})
export class TokensModule {}
