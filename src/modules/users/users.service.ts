import { Injectable } from '@nestjs/common'
import { IUsersServiceInterface } from './interfaces/users-service.interface'

export type User = any

@Injectable()
export class UsersService implements IUsersServiceInterface {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme'
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess'
    },
    {
      userId: 3,
      username: 'Hiep nguyen',
      password: '1213'
    }
  ]

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username)
  }
}
