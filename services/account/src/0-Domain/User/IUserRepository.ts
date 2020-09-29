import type { User, UserReadOnlyFields } from './User'

export interface IUserRepository {
  create(input: Partial<User>): Promise<User>
  getByUsername(username: string): Promise<User | null>
  updateByUsername(username: string, updatedFields: Omit<Partial<User>, UserReadOnlyFields>): Promise<User>
  
  countAll(): Promise<number>

  serialize(user: User): Promise<string>
  deserialize(username: string): Promise<User>
}