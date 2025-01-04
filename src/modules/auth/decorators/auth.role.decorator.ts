import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from 'src/constants/role.enum'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Roles } from './roles.decorator'
import { RolesGuard } from './roles.guard'

export function Auth(...roles: Role[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles))
}
