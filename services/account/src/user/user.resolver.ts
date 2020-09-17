import { Resolver, Query } from '@nestjs/graphql'
import { UserModel } from './user.model'
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