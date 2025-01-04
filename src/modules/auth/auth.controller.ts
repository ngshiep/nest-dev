import { Controller, Get, Param, Post, Req } from '@nestjs/common'
import { Public } from 'src/core/decorators/public.decorator'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('google-login/:token')
  async getGoogleLogin(@Param('token') token: string): Promise<any> {
    try {
      const userInfo = await this.authService.getUserGoogleInfo(token)
      return userInfo
    } catch (error) {
      throw error
    }
  }

  @Get('me')
  getProfile(@Req() req) {
    return this.authService.getUserById(req.user.id)
  }

  @Post('logout')
  async logout(@Req() req) {
    return req.logout()
  }
}
