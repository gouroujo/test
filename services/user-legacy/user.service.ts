import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel, Model } from 'nestjs-dynamoose'
import { v4 as uuidV4 } from 'uuid'
import { User, UserDocument, UserDefaultFields } from './user.schema'
import { find, uniqBy } from 'lodash'

import type { Model as DynamooseModel } from 'dynamoose/dist/Model'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel('user')
    private model: Model<User, User['username'], UserDefaultFields>,
    private readonly config: ConfigService,
  ) {
    this.configureModel(model as unknown as DynamooseModel<UserDocument>)
  }

  async onApplicationBootstrap() {
    if (!this.config.get<boolean>('isServerless', false)) {
      if (this.config.get<string>('CREATE_DEFAULT_ACCOUNT', null)) {
        const username = this.config.get<string>('CREATE_DEFAULT_ACCOUNT')
        const { count } = await this.model.scan().count().exec()
        if (count < 1) {
          console.log(`Create default account ${username}`)
          return this.model.create({
            username: 'test@admin',
            disabled: false,
            role: 'admin'
          })
        }
      }
    }
  }

  create(input: any) {
    return this.model.create({
      ...input,
      id: uuidV4(),
      disabled: false,
    })
  }

  findOne(key: User['username']): Promise<UserDocument> {
    return this.model.get(key) as Promise<UserDocument>
  }

  async findByUsername(username: User['username']): Promise<UserDocument> {
    const res = await this.model
      .query('username').eq(username)
      .where('disabled').eq(false)
      .exec()
    return res[0] as UserDocument
  }

  setMFA(key: User['username'], secret: string): Promise<UserDocument> {
    return this.model.update(key, {
      mfa: secret
    }) as Promise<UserDocument>
  }

  async confirmEmail(user: UserDocument, token: string): Promise<boolean> {
    if (token && user.confirmationToken === token) {
      await this.model.update(
        user.username, {
        confirmed: true,
        confirmationToken: undefined
      })
      return true
    }
    return false
  }

  private configureModel(model: DynamooseModel<UserDocument>) {
    // Document method
    model.methods.document.set('findIdentity', function(type: string, cb: Function) {
      cb(null, find(this.identities, ['type', type]))
    })
    model.methods.document.set('addIdentity', function(identity: any, cb: Function) {
      this.identities = uniqBy([
        identity,
        ...this.identities
      ], 'type')
      cb(null, this)
    })
    model.methods.document.set('hasGrantedAuthorization', function(clientId: string, scope: string, cb: Function) {
      cb(null, false)
    })

    // Model default serializer
    model.serializer.add("hashkey", {
      "include": ["username"]
    })
    model.serializer.default.set("hashkey")
  }
}