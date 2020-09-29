import {
  Controller, Get, Post, Body, UseGuards,
  Req, Session, Render, Res,
  UseFilters, Redirect, Query, ForbiddenException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import passport from 'passport'

import type { Request, Response } from 'express'

import { AuthenticatedGuard } from '../auth/auth.guard'
import { AuthExceptionFilter } from '../auth/auth.filter'

import { UserService } from '../user/user.service'
import { IdentityService } from '../identity/identity.service'
import { CurrentUser } from '../user/user.decorator'
import { UserDocument, User } from '../user/user.schema'
import { CsrfToken } from '../utils/csrf.decorator'

@Controller('profile')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class UserProfileController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    // private readonly identityService: IdentityService,
  ) {}

  @Get('')
  @Render('profile')
  profile(
    @CurrentUser('username') username: User['username'],
    @CurrentUser('profile') profile: User['profile'],
  ): any {
    return {
      lastname: profile.lastname,
      firstname: profile.firstname,
      username: profile.username,
    }
  }

  
  @Get('edit')
  @Render('profile-edit')
  editProfile(
    @CurrentUser('profile') profile: User['profile'],
    @CsrfToken() csrfToken: string,
  ): any {
    return {
      csrfToken,
      profile
    }
  }

  @Post('edit')
  @Redirect('/profile')
  async editProfileFrom(
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    user.profile = {
      ...user.profile,
      firstname,
      lastname,
    }
    await user.save()
  }
}
