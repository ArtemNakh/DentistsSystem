import { Request, Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/registerClient.dto';
import { LoginClientDto } from './dto/loginClient.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { LoginWorkerDto } from './dto/loginWorker.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registerClient')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register a new client',
    description: 'This endpoint registers a new client and creates a session.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    type: RegisterClientDto,
    description: 'Client registration payload',
    examples: {
      valid: {
        summary: 'Valid registration',
        value: {
          name: 'John',
          surname: 'Doe',
          middle_name: 'Michael',
          birthdate: '1990-05-15',
          blood_resus: 'plus',
          blood_group: 2,
          phone: '+1234567890',
          allergic_diseases: 'Pollen',
          email: 'john.doe@example.com',
          password: 'StrongPass123',
          passwordRepeat: 'StrongPass123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Client successfully registered and session created.',
    schema: {
      example: { clientId: 1, message: 'Client registered successfully' },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  public async registerClient(
    @Req() req: Request,
    @Body() dto: RegisterClientDto,
  ) {
    return this.authService.registerClient(req, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login client',
    description: 'This endpoint logs in a client and creates a session.',
  })
  @ApiBody({
    type: LoginClientDto,
    description: 'Client login payload',
    examples: {
      valid: {
        summary: 'Valid login',
        value: { email: 'john.doe@example.com', password: 'StrongPass123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Client successfully logged in and session created.',
    schema: {
      example: {
        access_token: 'jwt.token.here',
        client: { id: 1, name: 'John Doe' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  public async login(@Req() req: Request, @Body() dto: LoginClientDto) {
    return this.authService.loginClient(req, dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout client',
    description: 'This endpoint logs out the client and clears the session.',
  })
  @ApiSecurity('bearer')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer JWT token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Client successfully logged out.',
    schema: { example: { message: 'Successfully logged out' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutClient(req, res);
  }

  // ================= WORKER =================
  @Post('loginWorker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login worker',
    description:
      'Авторизація працівника за логіном та паролем. Повертає JWT токен та базову інформацію про працівника.',
  })
  @ApiBody({
    type: LoginWorkerDto,
    description: 'Дані для входу працівника',
    examples: {
      valid: {
        summary: 'Приклад валідного запиту',
        value: { login: 'ivan.petrenko', password: 'securePass123' },
      },
      invalid: {
        summary: 'Приклад невалідного запиту',
        value: { login: '', password: '' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Worker successfully logged in.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        worker: {
          id: 1,
          name: 'Іван',
          surname: 'Петренко',
          specialty: { id: 1, title: 'Стоматолог-хірург' },
          dentistry: { id: 2, name: 'Dentistry Clinic №1' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid login or password.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error (наприклад, порожні поля).',
    schema: {
      example: {
        statusCode: 400,
        message: ['login should not be empty', 'password should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  public async loginWorker(@Req() req: Request, @Body() dto: LoginWorkerDto) {
    return await this.authService.loginWorker(req, dto);
  }
  
  @Post('logoutWorker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout worker',
    description:
      'Вихід працівника із системи. Очищає сесію/кукі та інвалідовує токен.',
  })
  @ApiSecurity('bearer')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer JWT token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Worker successfully logged out.',
    schema: { example: { message: 'Successfully logged out' } },
  })
  public async logoutWorker(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutWorker(req, res);
  }
}
