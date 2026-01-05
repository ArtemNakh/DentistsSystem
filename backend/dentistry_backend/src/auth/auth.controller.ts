import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterClientDto } from './dto/registerClient.dto';
import { LoginClientDto } from './dto/loginClient.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiBody({
    type: RegisterClientDto,
    description: 'Client registration payload',
    examples: {
      example1: {
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
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
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
      example1: {
        summary: 'Valid login',
        value: { email: 'john.doe@example.com', password: 'StrongPass123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Client successfully logged in and session created.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  public async login(@Req() req: Request, @Body() dto: LoginClientDto) {
    return this.authService.loginClient(req, dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout client',
    description: 'This endpoint logs out the client and clears the session.',
  })
  @ApiResponse({ status: 200, description: 'Client successfully logged out.' })
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutClient(req, res);
  }
}
