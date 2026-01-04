import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Client")
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientService) {}

  @Get("test/all")
  findAll() {
    return this.clientsService.findAll();
  }

}
