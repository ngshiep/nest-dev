import { Module } from '@nestjs/common'
import { BinanceService } from '../binance/binance.service'
import { CronJobController } from './cron-job.controller'
import { CronJobService } from './cron-job.service'

@Module({
  controllers: [CronJobController],
  providers: [CronJobService, BinanceService]
})
export class CronJobModule {}
