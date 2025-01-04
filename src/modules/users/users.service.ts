import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { Role } from 'src/constants/role.enum'
import { UserDocument } from './entities/user.schema'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(userData: Partial<UserDocument>): Promise<UserDocument> {
    return this.userRepository.create(userData)
  }

  getAllUsers(): Promise<UserDocument[]> {
    return this.userRepository.findAll()
  }

  getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id)
  }

  getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email)
  }
  async updateUserAvatar(id: string, updateData: Partial<UserDocument>) {
    return this.userRepository.update(id, updateData)
  }

  async updateUser(id: string, updateData: Partial<UserDocument>) {
    const foundUser = await this.userRepository.findById(id)
    if (!foundUser || foundUser.roles.includes(Role.Admin)) {
      throw new UnprocessableEntityException('User not found or cannot delete admin')
    }
    return this.userRepository.update(id, updateData)
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    const foundUser = await this.userRepository.findById(id)
    if (!foundUser || foundUser.roles.includes(Role.Admin)) {
      throw new UnprocessableEntityException('User not found or cannot delete admin')
    }
    return this.userRepository.delete(id)
  }

  async findOne(username: string): Promise<UserDocument | undefined> {
    return this.userRepository.findOne((user) => user.username === username)
  }

  async inActiveUser(id: string): Promise<UserDocument | null> {
    const foundUser = await this.userRepository.findById(id)
    if (!foundUser || foundUser.roles.includes(Role.Admin)) {
      throw new UnprocessableEntityException('User not found or cannot delete admin')
    }
    return this.userRepository.softDelete(id)
  }

  async activeUser(id: string): Promise<UserDocument | null> {
    const foundUser = await this.userRepository.findById(id)
    if (!foundUser) {
      throw new NotFoundException('User not found')
    }
    return this.userRepository.reactivate(id)
  }
}
