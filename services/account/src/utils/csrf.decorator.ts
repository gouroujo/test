
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common'

export const CsrfToken = createParamDecorator(
  (data: null, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest()
    if (!request.csrfToken) {
      throw new InternalServerErrorException('CSURF middleware is not initialized.')
    }
    return request.csrfToken()
  },
)