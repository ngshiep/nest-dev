import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/decorators/jwt-auth.guard'
import { RolesGuard } from './modules/auth/decorators/roles.guard'
import { BinanceModule } from './modules/binance/binance.module'
import { CronJobModule } from './modules/cron-job/cron-job.module'
import { SystemCheckerModule } from './modules/system-checker/system-checker.module'

@Module({
  imports: [
    AuthModule,
    BinanceModule,
    CronJobModule,
    SystemCheckerModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING)
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
