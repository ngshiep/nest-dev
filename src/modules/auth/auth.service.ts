import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'
import { User, UserDocument } from '../users/entities/user.schema'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async getUserGoogleInfo(token: string): Promise<any> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, config)

      if (response.status !== 200) {
        throw new UnauthorizedException()
      }

      const userInfo = await response.data
      const user = await this.usersService.getUserByEmail(userInfo.email)

      if (!user) {
        throw new UnauthorizedException()
      }

      if (user.isDeleted) {
        throw new UnauthorizedException()
      }

      if (userInfo.picture && !user.avatar) {
        this.usersService.updateUserAvatar(user.id, { avatar: userInfo.picture })
      }
      return this.login(user)
    } catch {
      throw new UnauthorizedException()
    }
  }

  async login(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles }
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  getUserById(id: string): Promise<UserDocument | null> {
    return this.usersService.getUserById(id)
  }
}
