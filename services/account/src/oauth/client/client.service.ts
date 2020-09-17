import {
  randomBytes,
  pbkdf2,
  timingSafeEqual,
} from 'crypto'
import { promisify } from 'util'

import { Injectable, Inject } from '@nestjs/common'
import { InjectModel, Model } from 'nestjs-dynamoose'
import { ConfigType } from '@nestjs/config'
import { v4 as uuidV4 } from 'uuid'

import clientConfig from './client.config'
import { ClientDefaultFields, Client, ClientDocument } from './client.schema'

@Injectable()
export class ClientService {

  constructor(
    @InjectModel('client')
    private readonly model: Model<Client, Client['id'], ClientDefaultFields>,
    @Inject(clientConfig.KEY)
    private config: ConfigType<typeof clientConfig>,
  ) {}
  
  listAll() {
    return this.model.scan().exec()
  }

  listOwned(userId: string) {
    return Promise.resolve([])
  }

  async create(client: Client) {
    if (client.secret) {
      const salt = await this.generateSalt()
      const secret = await this.hashSecret(client.secret, salt)
      client.salt = salt.toString('base64')
      client.secret = secret.toString('base64')
    }
    return this.model.create({
      ...client,
      id: uuidV4(),
    })
  }

  async getClient(clientId: string): Promise<ClientDocument> {
    return this.model.get(clientId) as unknown as Promise<ClientDocument>
  }

  getClientBySecret(secret: string) {
    
  }

  async generateSecret(): Promise<string> {
    return (await promisify(randomBytes)(64)).toString('base64')
  }

  private generateSalt(length: number = 128): Promise<Buffer> {
    return promisify(randomBytes)(length)
  }

  private hashSecret(secret: string, salt: Buffer): Promise<Buffer> {
    return promisify(pbkdf2)(secret, salt, 100000, 64, 'sha512')
  }
}
