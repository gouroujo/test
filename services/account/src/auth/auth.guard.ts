import { ExecutionContext, Injectable, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!request.isAuthenticated()) {
      throw new UnauthorizedException()
    }
    if (!roles || roles.includes(request.user?.role ?? 'user')) {
      return true
    }
    throw new ForbiddenException()
  }
}