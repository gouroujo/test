import { Injectable } from '@nestjs/common'
import { InjectModel, Model } from 'nestjs-dynamoose'
import { v4 as uuidV4 } from 'uuid'
import { User, IUserStorageService } from '../../user.interface'


@Injectable()
export class UserStorageDynamooseService implements IUserStorageService {
  constructor(
    @InjectModel('user')
    private model: Model<User, User['username'], any>,
  ) {}

  create(userInput: any): Promise<User> {
    throw new Error('Method not implemented.')
  }

  read(username: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  update(username: string, userInput: any): Promise<User> {
    throw new Error('Method not implemented.')
  }
  
  delete(username: string): Promise<null> {
    throw new Error('Method not implemented.')
  }
  

  
}