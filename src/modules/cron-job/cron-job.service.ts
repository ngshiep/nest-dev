import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { plainToInstance } from 'class-transformer'
import { BinanceService } from '../binance/binance.service'
import { CreateCronJobDto } from './dto/create-cron-job.dto'
import { CronJobResponseDto } from './dto/cron-job-response.dto'

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name)
  private readonly jobData = new Map<string, CronJobResponseDto>()
  private readonly channelId = process.env.TELEGRAM_CHAT_ID

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private binanceService: BinanceService
  ) {}

  private async callback(name: string) {
    const data = this.jobData.get(name)
    const balanceData = await this.binanceService.getFuturesWalletBalanceWithKey(data.apiKey, data.apiSecret)
    if (balanceData !== undefined && balanceData !== null && !isNaN(parseFloat(balanceData))) {
      const balance = parseFloat(balanceData)

      // set current balance
      data.curentBalance = balance

      // calculate pnl balance
      if (data.isFollow) {
        if (data.heighestBalance || data.cbr) {
          data.pnlBalance = data.heighestBalance * (1 - data.cbr / 100)
        }
      }

      // check if balance is greater than target balance
      if (data.curentBalance > data.targetBalance) {
        if (!data.heighestBalance) {
          data.heighestBalance = data.curentBalance
        } else if (data.curentBalance > data.heighestBalance) {
          data.heighestBalance = data.curentBalance
        }
        data.isFollow = true
      }

      // check if pnl balance has been reached
      if (data.isFollow && data.curentBalance <= data.heighestBalance * (1 - data.cbr / 100)) {
        this.binanceService.sendMessageToChannel('Server test: Pnl balance has been reached', this.channelId)
        this.schedulerRegistry.deleteInterval(name)
        this.jobData.delete(name)
      }

      this.logger.warn(`Interval ${name} executing at time (${data})!, balance ${balance}`)
    }
  }

  addCronJob(name: string, crobJob: CreateCronJobDto) {
    if (this.jobData.has(name)) throw new NotFoundException(`Cron job "${name}" already exists`)

    this.jobData.set(name, { ...crobJob, isStopped: false })

    const interval = setInterval(() => this.callback(name), crobJob.time)
    this.schedulerRegistry.addInterval(name, interval)
    this.logger.log(`Added cron job "${name}"`)
  }

  deleteCronJob(name: string) {
    if (!this.schedulerRegistry.getIntervals().includes(name)) {
      throw new NotFoundException(`Cron job "${name}" does not exist.`)
    }
    this.schedulerRegistry.deleteInterval(name)
    this.jobData.delete(name) // Xóa dữ liệu liên quan
    this.logger.log(`Cron job "${name}" has been deleted`)
  }

  // Dừng interval job
  stopIntervalJob(name: string) {
    if (!this.schedulerRegistry.getIntervals().includes(name) || !this.jobData.has(name)) {
      throw new Error(`Interval job "${name}" does not exist.`)
    }

    const job = this.schedulerRegistry.getInterval(name)
    clearInterval(job)
    this.schedulerRegistry.deleteInterval(name)

    const jobData = this.jobData.get(name)
    jobData.isStopped = true
    this.logger.log(`Interval job "${name}" has been stopped.`)
  }

  // Khởi động lại interval job
  restartIntervalJob(name: string) {
    if (!this.jobData.has(name)) {
      throw new Error(`Interval job "${name}" does not exist.`)
    }

    if (this.schedulerRegistry.getIntervals().includes(name)) {
      this.stopIntervalJob(name)
    }

    const jobData = this.jobData.get(name)
    jobData.isStopped = false
    const { time: interval } = this.jobData.get(name)
    const intervalId = setInterval(() => this.callback(name), interval)
    this.schedulerRegistry.addInterval(name, intervalId)

    this.logger.log(`Interval job "${name}" has been restarted with ${interval}ms.`)
  }

  getCronJobs() {
    const result: CronJobResponseDto[] = []

    this.jobData.forEach((value, key) => {
      const cronJob = plainToInstance(CronJobResponseDto, value, {
        excludeExtraneousValues: true
      })
      result.push(cronJob)
      this.logger.log(`Cron job: ${key}, Data: ${JSON.stringify(value)}`)
    })
    // const jobs = this.schedulerRegistry.getIntervals()
    // jobs.forEach((key) => {
    //   const data = this.jobData.get(key)

    //   const cronJob = plainToInstance(CronJobResponseDto, data, {
    //     excludeExtraneousValues: true
    //   })
    //   result.push(cronJob)
    //   this.logger.log(`Cron job: ${key}, Data: ${JSON.stringify(data)}`)
    // })
    return result
  }
}
