import { Exclude, Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateCronJobDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  time: number

  @IsString()
  @IsNotEmpty()
  @Expose()
  apiKey: string

  @IsString()
  @IsNotEmpty()
  @Exclude()
  apiSecret: string
}
