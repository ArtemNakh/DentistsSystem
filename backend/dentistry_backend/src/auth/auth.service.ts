import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientService } from '@/clients/clients.service';
import { RegisterClientDto } from './dto/registerClient.dto';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { Client } from '@/clients/entities/client.entity';
import { LoginClientDto } from './dto/loginClient.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { WorkersService } from '@/workers/workers.service';
import { Worker } from '../workers/entities/workers.entity';
import { LoginWorkerDto } from './dto/loginWorker.dto';
import { RegisterWorkerDto } from '@/workers/dto/registerWorker.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly clientService: ClientService,
    private readonly workerService: WorkersService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  // ========================= CLIENT =========================
  /**
   * Реєстрація нового клієнта.
   * Виконує перевірку на дублювання email, створює клієнта та надсилає токен підтвердження.
   * @param req - HTTP Request
   * @param dto - DTO з даними для реєстрації клієнта
   * @throws ConflictException якщо клієнт з таким email вже існує
   * @returns Повідомлення про успішну реєстрацію
   */
  public async registerClient(req: Request, dto: RegisterClientDto) {
    const isExists = await this.clientService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException(
        'Registration failed. A client with the same email already exists.',
      );
    }
    const newClient = await this.clientService.createClient(dto);
    this.emailConfirmationService
      .sendVerificationToken(newClient.email)
      .catch((err) => console.error('Email error:', err));

    return {
      message:
        'You are successfully registered. Please confirm your email. A mail was sent to your email.',
    };
  }

  /**
   * Авторизація клієнта.
   * Перевіряє email, пароль та статус підтвердження пошти.
   * @param req - HTTP Request
   * @param dto - DTO з даними для входу
   * @throws NotFoundException якщо клієнта не знайдено
   * @throws UnauthorizedException якщо пароль некоректний або email не підтверджено
   * @returns Об’єкт із клієнтом та authToken
   */
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
      throw new UnauthorizedException(
        'Your email is not confirmed. Please, check your email and confirm him',
      );
    }
    return this.saveClientSession(req, client);
  }

  /**
   * Вихід клієнта із системи.
   * Завершує сесію та очищає cookie.
   * @param req - HTTP Request
   * @param res - HTTP Response
   * @throws InternalServerErrorException якщо сесію не вдалося завершити
   */
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

  /**
   * Збереження сесії клієнта.
   * @param req - HTTP Request
   * @param client - Об’єкт клієнта
   * @throws InternalServerErrorException якщо сесію не вдалося зберегти
   * @returns Об’єкт із клієнтом та authToken
   */
  public async saveClientSession(req: Request, client: Client) {
    return new Promise((resolve, reject) => {
      req.session.workerId = undefined; // Видалити workerId якщо був
      req.session.clientId = client.id.toString();
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              `Failed to save session. ${err?.message || 'Unknown error'}. Please check Redis connection and session configuration.`,
            ),
          );
        }
        const authToken = req.sessionID;
        resolve({ client, authToken });
      });
    });
  }

  // ========================= WORKER =========================

  /**
   * Авторизація працівника.
   * Перевіряє логін та пароль.
   * @param req - HTTP Request
   * @param dto - DTO з даними для входу працівника
   * @throws NotFoundException якщо працівника не знайдено
   * @throws UnauthorizedException якщо пароль некоректний
   * @returns Об’єкт із працівником та authToken
   */
  public async loginWorker(req: Request, dto: LoginWorkerDto) {
    const worker = await this.workerService.findByLogin(dto.login);
    if (!worker || !worker.password) {
      throw new NotFoundException('Worker not found. Please check your input.');
    }
    const isValidPassword = await verify(worker.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect password.');
    }
    return await this.saveWorkerSession(req, worker);
  }

  /**
   * Вихід працівника із системи.
   * Завершує сесію та очищає cookie.
   * @param req - HTTP Request
   * @param res - HTTP Response
   * @throws InternalServerErrorException якщо сесію не вдалося завершити
   */
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

  /**
   * Збереження сесії працівника.
   * @param req - HTTP Request
   * @param worker - Об’єкт працівника
   * @throws InternalServerErrorException якщо сесію не вдалося зберегти
   * @returns Об’єкт із працівником та authToken
   */
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
        const authToken = req.sessionID;
        resolve({ worker, authToken });
      });
    });
  }

  /**
   * Тимчасова реєстрація працівника.
   * Виконує перевірку на дублювання логіна та створює нового працівника.
   * @param req - HTTP Request
   * @param dto - DTO з даними для реєстрації працівника
   * @throws ConflictException якщо працівник з таким логіном вже існує
   * @returns Повідомлення про успішну реєстрацію
   */
  public async registerWorker(req: Request, dto: RegisterWorkerDto) {
    const isExists = await this.workerService.findByLoginTemp(dto.login);
    if (isExists) {
      throw new ConflictException(
        'Registration failed. A worker with the same login already exists.',
      );
    }
    const newWorker = await this.workerService.createWorkerTemporary(dto);
    return { message: 'Worker successfully registered.' };
  }
}
