import { Resolver, Query } from '@nestjs/graphql'
import { KeyModel } from './key.model'
import { KeyService } from './key.service'

@Resolver(() => KeyModel)
export class KeyResolver {
  constructor(
    private readonly service: KeyService
  ) {}

  @Query(/* istanbul ignore next */ () => [KeyModel])
  list() {
    return []
  }
}