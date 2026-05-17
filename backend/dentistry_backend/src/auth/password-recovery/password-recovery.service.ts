import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from '@/clients/clients.service';
import { EmailService } from '@/libs/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '@/tokens/entities/tokens.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenType } from '@/tokens/entities/tokens.interface';
import { Client } from '@/clients/entities/client.entity';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly clientService: ClientService,
    private readonly emailService: EmailService,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  public async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    const existingClient = await this.clientService.findByEmail(dto.email);

    if (!existingClient) {
      throw new NotFoundException(
        'Token doesn`t found. Please, check corrects input token or request new ',
      );
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingClient.email,
    );
    await this.emailService.sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async newPassword(
    dto: NewPasswordDto,
    token: string,
  ): Promise<boolean> {
    const existingToken = await this.tokenRepo.findOne({
      where: { token: token, type: TokenType.PASSWORD_RESET },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Token doesn`t found. Please, check corrects input token or request new ',
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Verified token ended. Please , request new token for confirmation reset password  ',
      );
    }

    const existingUser = await this.clientService.findByEmail(
      existingToken.email,
    );
    if (!existingUser) {
      throw new NotFoundException(
        'Client doesn`t found. Please , check introduced email and try again',
      );
    }

    await this.clientRepo.update(
      { id: existingUser.id },
      { password: await hash(dto.password) },
    );

    await this.tokenRepo.delete({
      id: existingToken.id,
      type: TokenType.PASSWORD_RESET,
    });

    return true;
  }

  private async generatePasswordResetToken(email: string): Promise<Token> {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.tokenRepo.findOne({
      where: {
        email: email,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (existingToken) {
      await this.tokenRepo.delete({
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      });
    }

    const passwordResetToken = await this.tokenRepo.create({
      email: email,
      token: token,
      expiresIn: expiresIn,
      type: TokenType.PASSWORD_RESET,
    });
    await this.tokenRepo.save(passwordResetToken);

    return passwordResetToken;
  }
}
