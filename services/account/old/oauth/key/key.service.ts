import {
  generateKeyPair
} from 'crypto'
import { promisify } from 'util'
import { Injectable, OnApplicationBootstrap, Inject } from '@nestjs/common'
import { InjectModel, Model } from 'nestjs-dynamoose'
import { v4 as uuidV4 } from 'uuid'
import { sign, SignOptions } from 'jsonwebtoken'
import { JWK } from 'node-jose'
import { ConfigType } from '@nestjs/config'

import { Key, KeyKey } from './key.model'
import keyConfig from './key.config'

@Injectable()
export class KeyService implements OnApplicationBootstrap {
  constructor(
    @InjectModel('key')
    private readonly model: Model<Key, KeyKey> & any,
    @Inject(keyConfig.KEY)
    private config: ConfigType<typeof keyConfig>,
  ) {}

  async onApplicationBootstrap() {
    // TODO: do not do this in a serverless environment
    const { count } = await this.model.scan('active').eq(true).count().exec()
    if (count < 1) {
      console.log('generating new key pair...')
      await this.model.create({
        id: uuidV4(),
        active: true,
        ...await this.generateKeyPair()
      })
    }
  }

  async getPublicKeys() {
    const keys = await this.model.scan().exec()
    const keystore = JWK.createKeyStore()
    for (const rawKey of keys) {
      const key = await JWK.asKey(
        rawKey.publicKey,
        'pem',
        { kid: rawKey.id, use: 'sig', alg: 'RS256' }
      )
      await keystore.add(key)
    }
    return keystore.toJSON()
  }

  async generateJWT(payload: any, options: Omit<SignOptions, 'algorithm' | 'keyid'> = {} ) {
    const [ key ] = await this.model.query('active').eq(1).limit(1).exec()
    return promisify(sign as any)(
      payload,
      { key: key.privateKey, passphrase: this.config.secret },
      { ...options, algorithm: 'RS256', keyid: key.id }
    )
  }

  private generateKeyPair() {
    return promisify(generateKeyPair)('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: this.config.secret // FIXME
      }
    })
  }
}