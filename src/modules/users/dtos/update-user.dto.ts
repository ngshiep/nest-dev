import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { Role } from 'src/constants/role.enum'

export class UpdateUserDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  name: string

  @IsArray()
  @ArrayNotEmpty({ message: 'Roles must not be empty' })
  @IsEnum(Role, { each: true, message: 'Each role must be a valid enum value' })
  roles: Role[]
}
