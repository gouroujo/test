import { Injectable } from '@nestjs/common'
import { InjectModel, Model } from 'nestjs-dynamoose'
import { v4 as uuidV4 } from 'uuid'
import { User, UserKey, UserDocument } from './model/user.model'
import { find, uniqBy } from 'lodash'


@Injectable()
export class UserService {
  constructor(
    @InjectModel('user')
    private model: Model<User, UserKey> & any,
  ) {
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
  }

  create(input: any) {
    return this.model.create({
      ...input,
      id: uuidV4(),
      disabled: false,
    })
  }

  findOne(key: UserKey) {
    return this.model.get(key)
  }

  async findByEmail(email: User['email']): Promise<UserDocument> {
    const res = await this.model
      .query('email').eq(email)
      .where('disabled').eq(false)
      .exec()
    return res[0]
  }

  setMFA(key: UserKey, secret: string): Promise<User> {
    return this.model.update(key, {
      mfa: secret
    })
  }


}