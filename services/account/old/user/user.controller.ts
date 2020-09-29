import {
  Controller, Inject,
  Get, Post, // HTTP methods
  Query, Body, // Data extract from query
  UseGuards, // Route decorator
  Req, Redirect, Render, // Route handler
  ForbiddenException, // HTTP Exception
} from '@nestjs/common'

import { AuthenticatedGuard } from 'src/auth/auth.guard'
import { CurrentUser } from 'src/utils/user.decorator'
import { AuthenticateFunction } from 'src/utils/authenticate.decorator'

import type { Request } from 'express'
import type { IUser, IUserService } from 'src/user/user.interface'

@Controller()
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: Pick<IUserService, 'confirmEmail' | 'create'>,
  ){}

  @UseGuards(AuthenticatedGuard)
  @Get('user/confirm')
  @Redirect('/')
  async confirmEmail(
    @CurrentUser() user: IUser,
    @Query('username') username: string,
    @Query('confirmation_token') token: string,
    @Req() req: Request,
  ) {
    if (user.username !== username) {
      throw new ForbiddenException({
        error: 'invalid_username',
        error_description: 'provided username does not match the logged user'
      })
    }
    await this.userService.confirmEmail(user, token)
    // if (!valid) {
    //   throw new ForbiddenException({
    //     error: 'invalid_confirmation_token',
    //     error_description: 'confirmation_token is invalid'
    //   })
    // }
    req.flash('success', 'EMAIL_CONFIRMED')
    return
  }

  @Post('signup')
  @Redirect('/')
  async signupForm(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Req() req : any,
    @Query('redirect') redirect?: string,
  ): Promise<{ url?: string, statusCode?: string }> {
    try {
      const user = await this.userService.create({
        username, password, firstname, lastname
      })
      // 5 - redirect to setup MFA if enabled
      if (true) {
        return { url: `/mfa/add${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
      }
      return redirect ? { url: redirect } : {}

    } catch (error) {
      req.flash('error', error.message)
      return {
        url: `/login?username=${username}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}` 
      }
    }

    // // 1 - Find if user (email) already exist
    // const existingUser = await this.userService.findByUsername(username)
    // if (existingUser) {
    //   // TODO : link new identity after succefull login
    //   req.flash('error', 'USER_ALREADY_EXIST')
    //   return {
    //     url: `/login?username=${username}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`
    //   }
    // }
    // // 2b - If not exist, create new identity object local-identity
    // const identity = await this.identityService.createLocalIdentity({ username, password })
    // // 3 - Create user
    // const user = await this.userService.create({
    //   username,
    //   identities: [identity],
    //   profile: { firstname, lastname }
    // })
    // // 4 - Make login
    // await promisify(req.login).bind(req)(user)

    // // 5 - redirect to setup MFA if enabled
    // if (true) {
    //   return { url: `/mfa/add${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    // }
    // return redirect ? { url: redirect } : {}
  }

  @Post('login')
  async loginForm(
    @AuthenticateFunction() authenticate: Function,
    // @Body('username') username: string,
    // @Body('password') password: string,
    // @Req() req: Request & any,
    // @Res() res: Response,
    // @Session() session: Request['session'],
    @Query('redirect') redirect?: string,
  ): Promise<void> {
    // const existingUser = await this.userService.findByUsername(username)
    // if (!!existingUser?.mfa) {
    //   session.credentials = { // FIXME
    //     username,
    //     password,
    //     secret: existingUser.mfa,
    //     ts: Date.now()
    //   }
    //   res.redirect(`/mfa/check${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`)
    // } else {
      
    // }
    authenticate({ redirect })
  }
}