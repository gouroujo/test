import 'jest'

import { UserRepository } from '../2-Gateway/User/Mock/Repository'
import { US0000_UserLocalLogin } from './US0000-UserLocalLogin'

describe('US 0000 : UserLocalLogin', () => {
  it('should throw an error if the user does not exist', async () => {
    const useCase = new US0000_UserLocalLogin(
      new UserRepository()
    )
    expect(() => useCase.exec({ username: 'toto', password: 'aze'})).toThrowError('BAD_CREDENTIALS')
  })
})