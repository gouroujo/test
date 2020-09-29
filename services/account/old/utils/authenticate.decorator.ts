import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common'
import passport from 'passport'

export const AuthenticateFunction = createParamDecorator<null, ExecutionContext, ({ redirect: string }) => any>(
  (data: null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const response = ctx.switchToHttp().getResponse()
    const next = ctx.switchToHttp().getNext()
    return ({ redirect }: { redirect?: string }) => passport.authenticate('local',{
      successRedirect: redirect ?? '/',
      failureRedirect: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
      failureFlash: true
    })(request, response, next)
  },
)