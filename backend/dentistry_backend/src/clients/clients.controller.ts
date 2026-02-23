import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { ClientService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags("Client")
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientService) {}

  @Get("test/all")
  findAll() {
    return this.clientsService.findAll();
  }

  
    @Get('me')
    async getCurrentClient(@Req() req: Request) {
      console.log("se",req.session)
      if (!req.session.clientId) {
        throw new UnauthorizedException('No client session');
      }
      const client = await this.clientsService.findById(
        Number(req.session.clientId),
      );
      return { clientId: req.session.clientId,  client };
    }
}
