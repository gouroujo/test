import { Injectable } from '@nestjs/common'
import { InjectModel, Model } from 'nestjs-dynamoose'
import * as uuid from 'uuid'

import { User, UserKey } from './model/user.model'


@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async create(input: any) {
    console.log(input)
    const res = await this.userModel.create({
      ...input,
      id: uuid.v4(),
      disabled: false,
    })
    console.log(res)
    return res
  }

  findOne(key: UserKey) {
    return this.userModel.get(key)
  }

  async findByEmail(email: User['email']) {
    const res = await this.userModel
      .query('email').eq(email)
      .where('disabled').eq(false)
      .exec()
    return res[0]
  }

  setMFA(key: UserKey, secret: string): Promise<User> {
    return this.userModel.update(key, {
      mfa: secret
    })
  }


}