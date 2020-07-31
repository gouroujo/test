import { Controller, Get, Query, Post, Body, UseGuards, Req, Session, Render, Header, Res, UseFilters } from '@nestjs/common'

import type { Request, Response } from 'express'

import { AuthenticatedGuard } from './auth/auth.guard'
import { AuthExceptionFilter } from './auth/auth.filter'

@Controller()
@UseFilters(AuthExceptionFilter)
export class OAuthController {
  @UseGuards(AuthenticatedGuard)
  @Get('authorize')
  authorize(
    @Res() res: Response,
    @Req() req: Request & { user : any },
    @Query('response_type') responseType: 'code',
    @Query('client_id') clientId: string,
    @Query('state') state: string,
    @Query('scope') scope: string,
    @Query('redirect_uri') redirectUri: string,

    // PKCE
    @Query('code_challenge') codeChallenge?: string,
    @Query('code_challenge_method') codeChallengeMethod?: 'S256',
    // confidential client
    @Body('client_secret') clientSecret?: string,
    // @Session() session: any, // req.session
  ) {
    // 1 - checking for all required parameters
    // 2 - authenticating the client if the client was issued a secret

    // req.user is the logged user
    // If the user has never logged in this app before
    // AND if the app is not a native one
    // render the authorize screen

    // If the user has already authorize this client
    // redirect back to the client with code
    const url = new URL(redirectUri)
    const params = new URLSearchParams([
      ['code', 'abc'],
      ['state', state],
      ['error', ''],
      ['error_description', '']
    ])
    url.search = params.toString()
    return {
      url: url.toString()
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('authorize')
  authorizeEndpoint(

  ) {
    // The user click on "Allow" or "Deny"
  }

  @Post('oauth/token')
  @Header('Cache-Control', 'no-store')
  @Header('Pragma', 'no-cache')
  tokenEndpoint(
    @Body('grant_type') grantType: 'authorization_code' | 'refresh_token',
    @Body('client_id') clientId: string,
    @Body('redirect_uri') redirectUri: string,

    @Body('code') code?: string,
    @Body('refresh_token') refreshToken?: string,

    // PKCE
    @Body('code_verifier') codeVerifier?: string,
    // confidential client
    @Body('client_secret') clientSecret?: string,
  ): {
    access_token: string,
    token_type: 'bearer',
    expires_in: number | null,
    refresh_token?: string,
    scope?: string
  } | {
    error: 'invalid_request'|'invalid_client'|'invalid_grant'|'invalid_scope'|'unauthorized_client'|'unsupported_grant_type',
    error_description?: string,
    error_uri?: string
  } {
    if (grantType === 'authorization_code') {
      // See https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
      // 1 - checking for all required parameters
      // 2 - authenticating the client if the client was issued a secret
      // 3 - authorization code is valid and has not expired
      // 4 - authorization code provided in the request was issued to the authenticated client (If the authorization code was issued to a confidential client)
      // 5 - ensure the redirect URI parameter present matches the redirect URI that was used to request the authorization code
    } else if (grantType === 'refresh_token') {
      // See https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/
      // 1 - checking for all required parameters
      // 2 - authenticating the client if the client was issued a secret
      // 3 - refresh token is valid, and has not expired
      // 4 - the refresh token in the request was issued to the authenticated client (If the refresh token was issued to a confidential client)
    }
    return {
      error: 'invalid_grant'
    }
  }
}
