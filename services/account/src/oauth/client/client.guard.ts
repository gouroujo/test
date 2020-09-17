import { ExecutionContext, Injectable, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { ClientService } from './client.service'

@Injectable()
export class ClientGuard implements CanActivate {
  
  constructor(
    private readonly service : ClientService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const {
      client_id: id,
      client_secret: secret,
      response_type: type,
    } = request.query
    
    const client = await this.service.getClient(id)
    console.log(client)
    return Promise.resolve(true)
  }
}