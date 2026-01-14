import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { EmailService } from 'src/libs/email/email.service';
import { Token } from 'src/tokens/entities/tokens.entity';
import { TokenType } from 'src/tokens/entities/tokens.interface';

import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDto } from './dto/confirmation.dto';
import { ClientService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/client.entity';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailConfirmationService {
  public constructor(
     @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    private readonly mailService: EmailService,
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async newVerification(req: Request, dto: ConfirmationDto) {
    const existingToken = await this.tokenRepo.findOne({
      where: { token: dto.token, type: TokenType.VERIFICATION },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Verification token didn`t found. Please sure, that you have got correct token  ',
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Verification token ended. Please ,request new token for confirmation',
      );
    }

    const existingUser = await this.clientService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        'Client with specified email didn`t found. Please ,sure , that you enter correct email',
      );
    }

    await this.clientRepo.update({ id: existingUser.id }, { isVerified: true });
    await this.tokenRepo.delete({
      id: existingToken.id,
      type: TokenType.VERIFICATION,
    });

    const updatedClient = await this.clientRepo.findOneBy({
      id: existingUser.id,
    });
     return this.authService.saveClientSession(req,updatedClient!);
    // return this.authService.saveSession(req,updatedClient!);
  }

  public async sendVerificationToken(email: string) {
    const verificationToken = await this.generateVerificationToken(email);

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return true;
  }

  private async generateVerificationToken(email: string): Promise<Token> {
    const token = uuidv4();
    const expireIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.tokenRepo.findOne({
      where: { email: email, type: TokenType.VERIFICATION },
    });

    if (existingToken) {
      await this.tokenRepo.delete({
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      });
    }

    const verificationToken = await this.tokenRepo.create({
      email: email,
      token: token,
      expiresIn: expireIn,
      type: TokenType.VERIFICATION,
    });
    await this.tokenRepo.save(verificationToken);

    return verificationToken;
  }
}
