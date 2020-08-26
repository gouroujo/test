import { Controller, Get, Query, Post, Options, Body, UseGuards, Req, Header, Res, UseFilters } from '@nestjs/common'

import type { Request, Response } from 'express'

import { AuthenticatedGuard } from './auth/auth.guard'
import { AuthExceptionFilter } from './auth/auth.filter'
import { UserService } from './user/user.service'
import { ConfigService } from '@nestjs/config'
import { OAuthService } from './oauth.service'
import { KeyService } from './key/key.service'

@Controller()
@UseFilters(AuthExceptionFilter)
export class OAuthController {
  
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly oauthService: OAuthService,
    private readonly keyService: KeyService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get('authorize')
  async authorize(
    @Res() res: Response,
    @Req() req: Request & { user : any },
    @Query('response_type') responseType: 'code',
    @Query('client_id') clientId: string,
    @Query('state') state: string,
    @Query('scope') scope: string,
    @Query('redirect_uri') redirectUri: string,

    // PKCE
    @Query('code_challenge') codeChallenge?: string,
    @Query('code_challenge_method') codeChallengeMethod: 'S256' | 'plain' = 'plain',
    // confidential client
    @Body('client_secret') clientSecret?: string,
  ) {
    // 1 - checking for all required parameters
    // 2 - authenticating the client if the client was issued a secret

    // If the user has never logged in this app before
    // AND if the app is not a native one
    // render the authorize screen
    const currentUser = req.user
    if (!await currentUser.hasGrantedAuthorization(clientId, scope)) {
      return res.render('authorize', {
        layout: false,
        service: this.configService.get('service'),
        title: 'Login',
        username: currentUser.email,
        url: req.url,
        scope: scope,
      })
    }

    // If the user has already authorize this client
    // redirect back to the client with code
    const url = new URL(redirectUri)
    const params = new URLSearchParams([
      ['code', this.oauthService.generateAuthorizationCode({
        clientId,
        redirectUri,
        username: currentUser.email,
        ...(codeChallenge ? {
          codeChallenge,
          codeChallengeMethod,
        }: {})
      })],
      ['state', state],
      ['error', ''],
      ['error_description', '']
    ])
    url.search = params.toString()
    console.log(url.toString())
    return res.redirect(url.toString())
  }

  @UseGuards(AuthenticatedGuard)
  @Post('authorize')
  authorizeForm(
    @Res() res: Response,
    @Req() req: Request & { user : any },
    @Query('response_type') responseType: 'code',
    @Query('client_id') clientId: string,
    @Query('state') state: string,
    @Query('scope') scope: string,
    @Query('redirect_uri') redirectUri: string,

    // PKCE
    @Query('code_challenge') codeChallenge?: string,
    @Query('code_challenge_method') codeChallengeMethod: 'S256' | 'plain' = 'plain',
    // confidential client
    @Body('client_secret') clientSecret?: string,
  ) {
    const currentUser = req.user
    // redirect back to the client with code
    const url = new URL(redirectUri)
    const params = new URLSearchParams([
      ['code', this.oauthService.generateAuthorizationCode({
        clientId,
        redirectUri,
        username: currentUser.email,
        ...(codeChallenge ? {
          codeChallenge,
          codeChallengeMethod,
        }: {})
      })],
      ['state', state],
      ['error', ''],
      ['error_description', '']
    ])
    url.search = params.toString()
    return res.redirect(url.toString())
  }

  @Post('oauth/token')
  @Header('Cache-Control', 'no-store')
  @Header('Pragma', 'no-cache')
  @Header('Access-Control-Allow-Credentials', 'true')
  @UseGuards(AuthenticatedGuard)
  async token(
    @Req() req: Request,
    @Body('grant_type') grantType: 'authorization_code' | 'refresh_token',
    @Body('client_id') clientId: string,
    @Body('redirect_uri') redirectUri: string,

    @Body('code') code?: string,
    @Body('refresh_token') refreshToken?: string,

    // PKCE
    @Body('code_verifier') codeVerifier?: string,
    // confidential client
    @Body('client_secret') clientSecret?: string,
  ): Promise<{
    access_token: string,
    token_type: 'bearer',
    expires_in: number | null,
    refresh_token?: string,
    scope?: string
  } | {
    error: 'invalid_request'|'invalid_client'|'invalid_grant'|'invalid_scope'|'unauthorized_client'|'unsupported_grant_type',
    error_description?: string,
    error_uri?: string
  }> {
    const currentUser = req.user
    const url = new URL(redirectUri)
    req.res.setHeader('Access-Control-Allow-Origin', url.origin) // Set CORS header

    if (grantType === 'authorization_code') {
      // See https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
      // 1 - checking for all required parameters
      const payload = this.oauthService.extractAuthorizationCode(code)

      if (clientSecret) {
      // 2 - authenticating the client if the client was issued a secret

      } else if (codeVerifier) {
      // 3 - authorization code is valid
        if (!this.oauthService.checkChallenge(
          payload.codeChallenge,
          codeVerifier,
          payload.codeChallengeMethod
        )) {
          return {
            error: 'invalid_request',
            error_description: 'code_verifier is not valid',
          }
        }
      } else {
        return {
          error: 'invalid_request',
          error_description: `client_secret (code flow) or code_verifier (PKCE flow) is required`,
        }
      }

      // 4 - authorization code provided in the request was issued to the authenticated client
      if (clientId !== payload.clientId) {
        return {
          error: 'invalid_request',
          error_description: 'client_id must match the one used to request authorization code',
        }
      }
      
      // 5 - ensure the redirect URI parameter present matches the redirect URI that was used to request the authorization code
      if (redirectUri !== payload.redirectUri) {
        return {
          error: 'invalid_request',
          error_description: 'redirect_uri must match the one used to request authorization code',
        }
      }

      return {
        access_token: await this.keyService.generateJWT({ foo: 'bar' }, { expiresIn: 60*60 }),
        refresh_token: this.oauthService.generateRefreshToken({ clientId, username: currentUser.email }),
        token_type: 'bearer',
        expires_in: 60*60*1000
      }
    } else if (grantType === 'refresh_token') {
      // See https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/
      // 1 - checking for all required parameters
      // 2 - authenticating the client if the client was issued a secret
      // 3 - refresh token is valid, and has not expired
      // 4 - the refresh token in the request was issued to the authenticated client (If the refresh token was issued to a confidential client)
    }
    return {
      error: 'unsupported_grant_type',
      error_description: 'only authorization_code or refresh_token is a valid grant_type',
    }
  }

  @Get('oauth/jwks')
  async jwks(): Promise<{
    // see https://tools.ietf.org/html/rfc7518
    keys: Array<{
      alg: 'RS256' | 'RS384' | 'RS512' // algorithm for the key RSASSA-PKCS1-v1_5 using SHA-*
      kty: 'RSA' // | 'EC' | 'oct' // key type : RSA, Elliptic Curve, Octet sequence (used to represent symmetric keys)
      use: 'sig' // how the key was meant to be used. sig represents signature verification
      e: string // exponent for a standard pem
      n: string // moduluos for a standard pem
      kid: string // unique identifier for the key
      x5c?: string[] // x509 certificate chain
      x5t?: string // thumbprint of the x.509 cert (SHA-1 thumbprint)
    }>
  }> {
    return this.keyService.getPublicKeys()
  }
}
