import {
  createHash,
  timingSafeEqual,
} from 'crypto'
import { Injectable } from '@nestjs/common'
import { sign, verify, decode } from 'jws'
import { mapKeys } from 'lodash'

type CodePayload = {
  clientId: string
  redirectUri: string
  username: string
  expiration: number,
  uuid: string,
  codeChallenge?: string
  codeChallengeMethod?: 'plain' | 'S256'
}

type RefreshTokenPayload = {
  clientId: string
  username: string
  expiration: number,
  uuid: string,
}

type CodePayloadMin = {
  c: string
  r: string
  u: string
  exp: number,
  uuid: string,
  cc: string,
  ccm: 'plain' | 'S256'
}

@Injectable()
export class OAuthService {
  generateAuthorizationCode(payload: Omit<CodePayload, 'expiration' | 'uuid'>): string {
    return sign({
      header: { alg: 'HS512' },
      payload: this.minificationPayload({
        ...payload,
        expiration: Date.now() + 60*1000,
        uuid: 'a'
      }),
      secret: 'has a van',
    })
  }

  generateRefreshToken(payload: Omit<RefreshTokenPayload, 'expiration' | 'uuid'>): string {
    return sign({
      header: { alg: 'HS512' },
      payload: {
        ...payload,
        expiration: Date.now() + 60*1000,
        uuid: 'a'
      },
      secret: 'has a van',
    })
  }

  extractAuthorizationCode(code: string): CodePayload {
    const { payload, signature, header } = decode(code)
    return this.deminificationPayload(JSON.parse(payload))
  }

  checkChallenge(
    challenge: string,
    verifier: string, // verifier encoded in base64url
    method: 'plain' | 'S256'
  ) {
    try {
      if (method === 'plain') {
        return timingSafeEqual(
          Buffer.from(verifier, 'base64'),
          Buffer.from(challenge, 'base64'),
        )
      }
      const hash = createHash('sha256')
      hash.update(verifier)
      return timingSafeEqual(
        hash.digest(),
        Buffer.from(challenge, 'base64'), // Accept base64url encoded data (https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)
      )
    } catch (_) {
      return false
    }

  }

  private minificationPayload(payload: CodePayload) : CodePayloadMin {
    const dict = {
      'clientId': 'c',
      'redirectUri': 'r',
      'username': 'u',
      'expiration': 'exp',
      'codeChallenge': 'cc',
      'codeChallengeMethod': 'ccm',
    }
    return mapKeys(payload, (_, key) => dict[key] ?? key) as CodePayloadMin
  }

  private deminificationPayload(min: CodePayloadMin) : CodePayload {
    const dict = {
      c: 'clientId',
      r: 'redirectUri',
      u: 'username',
      exp: 'expiration',
      cc: 'codeChallenge',
      ccm: 'codeChallengeMethod',
    }
    return mapKeys(min, (_, key) => dict[key] ?? key) as CodePayload
  }
}
