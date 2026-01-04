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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registerClient')
  @HttpCode(HttpStatus.OK)
  public async registerClient(
    @Req() req: Request,
    @Body() dto: RegisterClientDto,
  ) {
    return this.authService.registerClient(req, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() req: Request, @Body() dto: LoginClientDto) {
    return this.authService.loginClient(req, dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutClient(req, res);
  }
}
