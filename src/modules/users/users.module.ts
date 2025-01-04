import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './entities/user.schema'
import { UserRepository } from './repositories/user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService, UserRepository],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
})
export class UsersModule {}
