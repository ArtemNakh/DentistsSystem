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
import { NewVerificationResponseDto } from './dto/Response/NewVerification.response.dto';
import { plainToInstance } from 'class-transformer';

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
    type: NewVerificationResponseDto,
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
  ): Promise<NewVerificationResponseDto> {
    const client = await this.emailConfirmationService.newVerification(
      req,
      dto,
    );
    return plainToInstance(NewVerificationResponseDto, client, {
      excludeExtraneousValues: true,
    });
  }
}
