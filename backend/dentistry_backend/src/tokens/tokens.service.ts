import { Injectable } from '@nestjs/common';
import { Token } from './entities/tokens.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokensService {
  constructor(@InjectRepository(Token) private tokenRepo: Repository<Token>) {}
}
