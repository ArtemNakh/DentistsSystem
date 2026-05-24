import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { NewPasswordDto } from './dto/new-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Password Recovery')
@Controller('password-recovery')
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'This endpoint generates a password reset token and sends it to the user’s email.',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Email клієнта, який запитує відновлення пароля',
    examples: {
      valid: {
        summary: 'Валідний email',
        value: { email: 'user@example.com' },
      },
      invalid: {
        summary: 'Невалідний email',
        value: { email: 'wrong-email-format' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Токен для відновлення пароля успішно згенеровано та надіслано на email.',
    schema: {
      type: 'boolean',
      example: true,
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
          example: ['Enter correct email', 'Field email can not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Клієнта з вказаним email не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Client with specified email didn`t found. Please, sure , that you enter correct email',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
   
    return this.passwordRecoveryService.resetPassword(dto);
  }

  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set new password',
    description:
      'This endpoint verifies the reset token and updates the client’s password.',
  })
  @ApiParam({
    name: 'token',
    description: 'Токен для відновлення пароля, отриманий на email',
    example: '4277349b-1e9b-4adf-bf23-c934fe55c356',
  })
  @ApiBody({
    type: NewPasswordDto,
    description: 'Новий пароль клієнта',
    examples: {
      valid: {
        summary: 'Валідний новий пароль',
        value: { password: 'StrongPass123' },
      },
      invalid: {
        summary: 'Невалідний пароль',
        value: { password: '123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Пароль успішно оновлено',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Невалідний або прострочений токен / некоректний пароль',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example:
            'Verified token ended. Please, request new token for confirmation reset password',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Токен або клієнт не знайдено',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Client doesn`t found. Please, check introduced email and try again',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param('token') token: string,
  ) {
    return this.passwordRecoveryService.newPassword(dto, token);
  }
}
