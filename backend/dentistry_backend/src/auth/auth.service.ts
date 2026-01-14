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
import { WorkersService } from 'src/workers/workers.service';
import { Worker } from '../workers/entities/workers.entity';
import { RegisterWorkerDto } from './dto/registerWorker.dto';
import { LoginWorkerDto } from './dto/loginWorker.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly clientService: ClientService,
    private readonly workerService: WorkersService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  // public async registerClient(req: Request, dto: RegisterClientDto) {
  //   const isExists = await this.clientService.findByEmail(dto.email);

  //   if (isExists) {
  //     throw new ConflictException(
  //       'Registration falied. A user with the same email already exists. Please use a different email and log in',
  //     );
  //   }

  //   const newUser = await this.clientService.createClient({
  //     name: dto.name,
  //     surname: dto.surname,
  //     middle_name: dto.middle_name,
  //     blood_resus: dto.blood_resus,
  //     blood_group: dto.blood_group,
  //     birthdate: dto.birthdate,
  //     phone: dto.phone,
  //     allergic_diseases: dto.allergic_diseases,
  //     email: dto.email,
  //     password: dto.password,
  //   });

  //   //додати підтвердження пошти
  //   await this.emailConfirmationService.sendVerificationToken(newUser.email);

  //   return {
  //     mesage:
  //       'You are successfully registrate. Please,confirm your email. Mail was send on your email  ',
  //   };
  // }
  // public async loginClient(req: Request, dto: LoginClientDto) {
  //   const client = await this.clientService.findByEmail(dto.email);
  //   if (!client || !client.password) {
  //     throw new NotFoundException(
  //       ' Client doesn`t found. Please , check enter value',
  //     );
  //   }

  //   const isValidPssword = await verify(client.password, dto.password);

  //   if (!isValidPssword) {
  //     throw new UnauthorizedException(
  //       'Uncorrect password. Please, repeat or recovery password, if foget him ',
  //     );
  //   }

  //   if (!client.isVerified) {
  //     await this.emailConfirmationService.sendVerificationToken(client.email);
  //     throw new UnauthorizedException(
  //       'Your email doesn`t confirm. Please, check your email and confirm him',
  //     );
  //   }

  //   return this.saveSession(req, client);
  // }

  // public async logoutClient(req: Request, res: Response): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     req.session.destroy((err) => {
  //       if (err) {
  //         return reject(
  //           new InternalServerErrorException(
  //             'The session could not be ended. There may be a problem with the server or the session has already ended',
  //           ),
  //         );
  //       }

  //       res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
  //       resolve();
  //     });
  //   });
  // }

  // public async saveSession(req: Request, client: Client) {
  //   return new Promise((resolve, reject) => {
  //     req.session.clientId = client.id.toString();

  //     req.session.save((err) => {
  //       if (err) {
  //         console.error('Session save error:', err);
  //         console.error('Error message:', err?.message);
  //         console.error('Error code:', err?.code);
  //         console.error('Error stack:', err?.stack);

  //         return reject(
  //           new InternalServerErrorException(
  //             `Failed to save session. ${err?.message || 'Unknown error'}. Please check Redis connection and session configuration.`,
  //           ),
  //         );
  //       }
  //       resolve({ client });
  //     });
  //   });
  // }

  // ========================= CLIENT =========================

  public async registerClient(req: Request, dto: RegisterClientDto) {
    const isExists = await this.clientService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException(
        'Registration failed. A client with the same email already exists.',
      );
    }
    const newClient = await this.clientService.createClient(dto);
    await this.emailConfirmationService.sendVerificationToken(newClient.email);
    return {
      message:
        'You are successfully registered. Please confirm your email. A mail was sent to your email.',
    };
  }

  public async loginClient(req: Request, dto: LoginClientDto) {
    const client = await this.clientService.findByEmail(dto.email);
    if (!client || !client.password) {
      throw new NotFoundException('Client not found. Please check your input.');
    }
    const isValidPassword = await verify(client.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect password.');
    }
    if (!client.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(client.email);
      throw new UnauthorizedException('Your email is not confirmed.');
    }
    return this.saveClientSession(req, client);
  }

  public async logoutClient(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Failed to end client session.'),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

public async saveClientSession(req: Request, client: Client) {
  return new Promise((resolve, reject) => {
    req.session.workerId = undefined;  // Видалити workerId якщо був
    req.session.clientId = client.id.toString();
    req.session.save((err) => {
      if (err) {
        return reject(
          new InternalServerErrorException('Failed to save client session.'),
        );
      }
      resolve({ client });
    });
  });
}

  // ========================= WORKER =========================

  // public async registerWorker(req: Request, dto: RegisterWorkerDto) {
  //   const isExists = await this.workerService.findByLogin(dto.login);
  //   if (isExists) {
  //     throw new ConflictException(
  //       'Registration failed. A worker with the same login already exists.',
  //     );
  //   }
  //   const newWorker = await this.workerService.createWorker(dto);
  //   return { message: 'Worker successfully registered.' };
  // }

public async loginWorker(req: Request, dto: LoginWorkerDto) {
  const worker = await this.workerService.findByLogin(dto.login);
  if (!worker || !worker.password) {
    throw new NotFoundException('Worker not found. Please check your input.');
  }
  const isValidPassword = await verify(worker.password, dto.password);
  if (!isValidPassword) {
    throw new UnauthorizedException('Incorrect password.');
  }
  return await this.saveWorkerSession(req, worker);  // ← Додати await
}

  public async logoutWorker(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Failed to end worker session.'),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  private async saveWorkerSession(req: Request, worker: Worker) {
  return new Promise((resolve, reject) => {
    req.session.clientId = undefined;  
    req.session.workerId = worker.id.toString();
    req.session.save((err) => {
      if (err) {
        return reject(
          new InternalServerErrorException('Failed to save worker session.'),
        );
      }
      resolve({ worker });
    });
  });
}
}
