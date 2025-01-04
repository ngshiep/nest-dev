import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Role } from 'src/constants/role.enum'
import { BaseDocument } from 'src/core/shemas/base.schema'

export type UserDocument = HydratedDocument<User>
@Schema({ timestamps: true })
export class User extends BaseDocument {
  @Prop()
  name: string

  @Prop({ unique: true, required: true })
  email: string

  @Prop()
  avatar: string

  @Prop({ type: [String], enum: Role, default: [Role.User] })
  roles: Role[]
}

export const UserSchema = SchemaFactory.createForClass(User)
