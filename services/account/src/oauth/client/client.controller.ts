import { Controller, UseGuards, UseFilters, Get, Render, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common'

import { AuthenticatedGuard } from 'src/auth/auth.guard'
import { AuthExceptionFilter } from 'src/auth/auth.filter'
import { Roles } from 'src/auth/roles.decorator'

import { ClientService } from './client.service'
import { CurrentUser } from 'src/user/user.decorator'
import { CsrfToken } from 'src/utils/csrf.decorator'
import { CreateClientDto } from './client-create.dto'

@Controller('clients')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Get()
  @Roles('admin', 'manager')
  @Render('client-list')
  async list(
    @CurrentUser('id') userId : string,
    @CurrentUser('role') userRole : 'admin' | 'manager'
  ) {
    const clients = userRole === 'admin' ?
      await this.clientService.listAll() : await this.clientService.listOwned(userId)
    
      return {
      layout: 'client-layout',
      clients,
    }
  }

  @Get('add')
  @Roles('admin', 'manager')
  @Render('client-add')
  async add(
    @CsrfToken() csrfToken: string,
  ) {
    const clients = await this.clientService.listAll()
    return {
      layout: 'client-layout',
      csrfToken
    }
  }

  @Post('add')
  @Roles('admin', 'manager')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async addForm(
    @Body() client: CreateClientDto
  ) {
    if (client.type === 'confidential') {
      client.secret = await this.clientService.generateSecret()
    }
    return {
      ...await this.clientService.create({
        ...client,
      }),
      ...(client.type === 'confidential' ? { secret: client.secret }: {})
    }
  }
}
