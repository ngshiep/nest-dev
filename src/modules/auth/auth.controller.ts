import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(@Body() createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return req.logout();
  }
}
