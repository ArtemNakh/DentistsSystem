import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Token } from './entities/tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  
    imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService],
    exports: [TokensService, TypeOrmModule],
})
export class TokensModule {}
