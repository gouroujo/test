import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch(UnauthorizedException, ForbiddenException)
export class AuthExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request & { flash: Function }>()
    if (
      exception instanceof UnauthorizedException
    ) {
      if (request.method === 'GET') {
        request.flash('error', 'AUTHENTICATION_REQUIRED')
        response.redirect(`/login${request.url !== '/' ? `?redirect=${encodeURIComponent(request.url)}` : ''}`)
      } else {
        response.status(401).json({ error: 'unauthorized' })
      }
    } else if (
      exception instanceof ForbiddenException
    ) {
      request.flash('error', 'FORBIDDEN')
      response
        .status(exception.getStatus())
        .json(exception.getResponse())
    }
  }
}