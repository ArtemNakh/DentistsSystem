import { Request, Response } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseInterceptors,
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
import { RegisterWorkerDto } from '@/workers/dto/registerWorker.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrationClient')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register a new client',
    description: 'This endpoint registers a new client and creates a session.',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    type: RegisterClientDto,
    description: 'Payload для реєстрації клієнта',
    examples: {
      valid: {
        summary: 'Валідна реєстрація',
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
      invalid: {
        summary: 'Невалідна реєстрація',
        value: {
          name: '',
          surname: '',
          email: 'wrong-email',
          password: '123',
          passwordRepeat: '321',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Клієнт успішно зареєстрований та створена сесія',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'You are successfully registered. Please confirm your email. A mail was sent to your email.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'Name must be string',
            'Uncorrect format email',
            'Password doesn`t be same',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Клієнт з таким email вже існує',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example:
            'Registration failed. A client with the same email already exists.',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Server Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
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
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    type: LoginClientDto,
    description: 'Payload для входу клієнта',
    examples: {
      valid: {
        summary: 'Валідний логін',
        value: { email: 'john.doe@example.com', password: 'StrongPass123' },
      },
      invalid: {
        summary: 'Невалідний логін',
        value: { email: 'wrong-email', password: '123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Клієнт успішно авторизований та створена сесія',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'jwt.token.here',
        },
        client: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            isVerified: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректні дані у запиті',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'Email must be string',
            'Uncorrect format email',
            'Password must containt minimal 6 letter',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Невірні облікові дані або email не підтверджено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: {
          type: 'string',
          example:
            'Your email is not confirmed. Please, check your email and confirm him',
        },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Клієнта не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Client not found. Please check your input.',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Server Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
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
    description: 'Bearer JWT токен',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Клієнт успішно вийшов із системи',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully logged out' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний запит або сесія вже завершена',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example:
            'The session could not be ended. There may be a problem with the server or the session has already ended',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований клієнт',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized client' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example:
            'The session could not be ended. There may be a problem with the server',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
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
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiBody({
    type: LoginWorkerDto,
    description: 'Дані для входу працівника',
    examples: {
      valid: {
        summary: 'Валідний запит',
        value: { login: 'ivan.petrenko', password: 'SecurePass123!' },
      },
      invalid: {
        summary: 'Невалідний запит',
        value: { login: '', password: '' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Працівник успішно авторизований',
    schema: {
      type: 'object',
      properties: {
        authToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        worker: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Іван' },
            surname: { type: 'string', example: 'Петренко' },
            specialty: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Стоматолог-хірург' },
              },
            },
            dentistry: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 2 },
                name: { type: 'string', example: 'Dentistry Clinic №1' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Помилка валідації (наприклад, порожні поля)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'login should not be empty',
            'password should not be empty',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний логін або пароль',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Incorrect password.' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Працівника не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Worker not found. Please check your input.',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Server Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async loginWorker(@Req() req: Request, @Body() dto: LoginWorkerDto) {
    return await this.authService.loginWorker(req, dto);
  }

  @Post('logoutWorker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Вихід працівника',
    description:
      'Ендпоінт завершує сесію працівника, очищає cookie та інвалідовує токен.',
  })
  @ApiSecurity('bearer')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer JWT токен',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Працівник успішно вийшов із системи',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully logged out' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некоректний запит або сесія вже завершена',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example:
            'Failed to end worker session. The session may already be ended or server error occurred',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизований працівник',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized worker' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутрішня помилка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Failed to end worker session.',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async logoutWorker(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutWorker(req, res);
  }

  //temporary
  /*
  
  {
  "name": "Іван",
  "surname": "Петренко",
  "middle_name": "Олегович",
  "birthday": "1990-05-15",
  "phone": "+380671234567",
  "login": "ivan.petrenko",
  "password": "SecurePass123!",
  "specialtyId": 1,
  "dentistryId": 1
}
  
*/
  @Post('registerWorker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new worker' })
  @ApiBody({ type: RegisterWorkerDto })
  @ApiBody({
    type: RegisterWorkerDto,
    examples: {
      example: {
        summary: 'Приклад даних для реєстрації працівника',
        value: {
          name: 'Іван',
          surname: 'Петренко',
          middle_name: 'Олегович',
          birthday: '1990-05-15',
          phone: '+380671234567',
          login: 'ivan.petrenko',
          password: 'SecurePass123!',
          specialtyId: 1,
          dentistryId: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Worker successfully registered.' })
  public async registerWorker(
    @Req() req: Request,
    @Body() dto: RegisterWorkerDto,
  ) {
    console.log(dto);
    return this.authService.registerWorker(req, dto);
  }
}
