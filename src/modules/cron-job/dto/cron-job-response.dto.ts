import { Expose } from 'class-transformer'
import { CreateCronJobDto } from './create-cron-job.dto'

export class CronJobResponseDto extends CreateCronJobDto {
  @Expose()
  curentBalance?: number

  @Expose()
  heighestBalance?: number

  @Expose()
  pnlBalance?: number

  @Expose()
  isFollow?: boolean

  @Expose()
  isStopped?: boolean
}
