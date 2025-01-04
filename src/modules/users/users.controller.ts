import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common'
import { Role } from 'src/constants/role.enum'
import { Auth } from '../auth/decorators/auth.role.decorator'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // create new account
  @Post()
  @Auth(Role.Admin)
  @HttpCode(201)
  async createNewAcc(@Body() user: CreateUserDto) {
    await this.usersService.createUser(user)
    return 'User created'
  }

  // update user information
  @Put(':id')
  @Auth(Role.Admin)
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    await this.usersService.updateUser(id, user)
    return 'User updated'
  }

  // inactivate user
  @Patch('inactivate/:id')
  @Auth(Role.Admin)
  async inactivateUser(@Param('id') id: string) {
    await this.usersService.inActiveUser(id)
    return 'User inactivated'
  }

  // activate user
  @Patch('activate/:id')
  @Auth(Role.Admin)
  async activateUser(@Param('id') id: string) {
    await this.usersService.activeUser(id)
    return 'User activated'
  }

  // delete user
  @Delete(':id')
  @Auth(Role.Admin)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id)
    return 'User deleted'
  }

  // get all users with infomation
  @Get()
  @Auth(Role.Admin)
  async getAllUsers() {
    return this.usersService.getAllUsers()
  }

  // get user by id
  @Get(':id')
  @Auth(Role.Admin)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id)
  }
  // update api key
}
