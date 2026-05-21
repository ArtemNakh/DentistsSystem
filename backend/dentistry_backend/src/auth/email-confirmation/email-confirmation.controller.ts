import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationDto } from './dto/confirmation.dto';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Email Confirmation')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email confirmation token',
    description:
      'This endpoint verifies the provided email confirmation token and marks the client as verified.',
  })
  @ApiBody({
    type: ConfirmationDto,
    description: 'Confirmation token payload',
    examples: {
      example1: {
        summary: 'Valid token example',
        value: { token: '4277349b-1e9b-4adf-bf23-c934fe55c356' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Email успішно підтверджено, клієнт позначений як верифікований.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 12 },
        name: { type: 'string', example: 'Rosemarie' },
        surname: { type: 'string', example: 'Powlowski-Bednar' },
        email: { type: 'string', example: 'Jacques_Hackett@hotmail.com' },
        isVerified: { type: 'boolean', example: true },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-04-08T15:20:33.000Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2026-05-21T15:20:33.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Невалідний або прострочений токен',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example:
            'Verification token ended. Please, request new token for confirmation',
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
            'Verification token didn`t found. Please sure, that you have got correct token',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async newVerification(
    @Req() req: Request,
    @Body() dto: ConfirmationDto,
  ) {
    return this.emailConfirmationService.newVerification(req, dto);
  }
}
