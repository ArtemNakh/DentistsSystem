import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientService } from 'src/clients/clients.service';
import { RegisterClientDto } from './dto/registerClient.dto';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { Client } from 'src/clients/entities/client.entity';
import { LoginClientDto } from './dto/loginClient.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  public constructor(
    private readonly clientService: ClientService,

    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  public async registerClient(req: Request, dto: RegisterClientDto) {
    const isExists = await this.clientService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException(
        'Registration falied. A user with the same email already exists. Please use a different email and log in',
      );
    }

    const newUser = await this.clientService.createClient({
      name: dto.name,
      surname: dto.surname,
      middle_name: dto.middle_name,
      blood_resus: dto.blood_resus,
      blood_group: dto.blood_group,
      birthdate: dto.birthdate,
      phone: dto.phone,
      allergic_diseases: dto.allergic_diseases,
      email: dto.email,
      password: dto.password,
    });

    //додати підтвердження пошти
    await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      mesage:
        'You are successfully registrate. Please,confirm your email. Mail was send on your email  ',
    };
  }
  public async loginClient(req: Request, dto: LoginClientDto) {
    const client = await this.clientService.findByEmail(dto.email);
    if (!client || !client.password) {
      throw new NotFoundException(
        ' Client doesn`t found. Please , check enter value',
      );
    }

    const isValidPssword = await verify(client.password, dto.password);

    if (!isValidPssword) {
      throw new UnauthorizedException(
        'Uncorrect password. Please, repeat or recovery password, if foget him ',
      );
    }

    if (!client.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(client.email);
      throw new UnauthorizedException(
        'Your email doesn`t confirm. Please, check your email and confirm him',
      );
    }

    return this.saveSession(req, client);
  }

  public async logoutClient(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'The session could not be ended. There may be a problem with the server or the session has already ended',
            ),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  // public async saveSession(req: Request, client: Client) {
  //   return new Promise((resolve, reject) => {
  //     req.session.userId = client.id.toString();

  //     req.session.save((err) => {
  //       if (err) {
  //         return reject(
  //           new InternalServerErrorException(
  //             'Failed saved session. Check, correct settings session',
  //           ),
  //         );
  //       }
  //       resolve({ client });
  //     });
  //   });

  // }
  public async saveSession(req: Request, client: Client) {
    return new Promise((resolve, reject) => {
      req.session.userId = client.id.toString();

      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          console.error('Error message:', err?.message);
          console.error('Error code:', err?.code);
          console.error('Error stack:', err?.stack);

          return reject(
            new InternalServerErrorException(
              `Failed to save session. ${err?.message || 'Unknown error'}. Please check Redis connection and session configuration.`,
            ),
          );
        }
        resolve({ client });
      });
    });
  }
}
