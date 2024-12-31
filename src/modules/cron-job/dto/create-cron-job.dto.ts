import { Expose } from 'class-transformer'
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

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  targetBalance: number

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  cbr: number

  @IsString()
  @IsNotEmpty()
  @Expose()
  apiKey: string

  @IsString()
  @IsNotEmpty()
  apiSecret: string
}
