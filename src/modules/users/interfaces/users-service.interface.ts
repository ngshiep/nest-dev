import { User } from '../users.service'

export interface IUsersServiceInterface {
  findOne(username: string): Promise<User | undefined>
}
