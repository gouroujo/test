import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request & { flash: Function }>()
    if (
      exception instanceof UnauthorizedException
    ) {
      if (request.method === 'GET') {
        request.flash('error', 'AUTHENTICATION_REQUIRED')
        response.redirect('/login')
      } else {
        response.status(401).json({ error: 'unauthorized' })
      }
    } else if (
      exception instanceof ForbiddenException
    ) {
      request.flash('error', 'FORBIDDEN')
    }
  }
}