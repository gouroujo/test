import { Resolver, Query } from '@nestjs/graphql'
import { UserModel } from './model/user.model'
import { UserService } from './user.service'

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Query(/* istanbul ignore next */ () => [UserModel])
  list() {
    return []
  }
}