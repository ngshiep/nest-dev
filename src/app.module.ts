import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { BinanceModule } from './modules/binance/binance.module'
import { CronJobModule } from './modules/cron-job/cron-job.module'

@Module({
  imports: [
    AuthModule,
    BinanceModule,
    CronJobModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
