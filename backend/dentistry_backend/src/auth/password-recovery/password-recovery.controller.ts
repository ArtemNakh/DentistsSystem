import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
    description: 'Email address of the client requesting password reset',
    examples: {
      example1: {
        summary: 'Valid email',
        value: { email: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Password reset token successfully generated and sent via email.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client with the specified email not found.',
  })
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
    description: 'Password reset token received via email',
    example: '4277349b-1e9b-4adf-bf23-c934fe55c356',
  })
  @ApiBody({
    type: NewPasswordDto,
    description: 'New password payload',
    examples: {
      example1: {
        summary: 'Valid new password',
        value: { password: 'StrongPass123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @ApiResponse({ status: 404, description: 'Token or client not found.' })
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param('token') token: string,
  ) {
    return this.passwordRecoveryService.newPassword(dto, token);
  }
}
