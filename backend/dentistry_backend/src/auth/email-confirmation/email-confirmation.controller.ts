import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
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
    description: 'Email successfully verified and client marked as verified.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @ApiResponse({ status: 404, description: 'Token or client not found.' })
  public async newVerification(
    @Req() req: Request,
    @Body() dto: ConfirmationDto,
  ) {
    return this.emailConfirmationService.newVerification(req, dto);
  }
}
