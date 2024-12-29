import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { plainToInstance } from 'class-transformer'
import { BinanceService } from '../binance/binance.service'
import { CreateCronJobDto } from './dto/create-cron-job.dto'

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name)
  private readonly jobData = new Map<string, CreateCronJobDto>()

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private binanceService: BinanceService
  ) {}

  private async callback(name: string) {
    const data = this.jobData.get(name)
    const accountInfo = await this.binanceService.getFuturesWalletBalanceWithKey(data.apiKey, data.apiSecret)
    this.logger.warn(`Interval ${name} executing at time (${data})!, balance ${accountInfo}`)
  }

  addCronJob(name: string, milliseconds: number, apiKey: string, apiScrete: string) {
    this.jobData.set(name, { name, apiKey, apiSecret: apiScrete, time: milliseconds })

    const interval = setInterval(() => this.callback(name), milliseconds)
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
    if (!this.schedulerRegistry.getIntervals().includes(name)) {
      throw new Error(`Interval job "${name}" does not exist.`)
    }

    const job = this.schedulerRegistry.getInterval(name)
    clearInterval(job)
    this.schedulerRegistry.deleteInterval(name)
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

    const { time: interval } = this.jobData.get(name)
    const intervalId = setInterval(() => this.callback(name), interval)
    this.schedulerRegistry.addInterval(name, intervalId)

    this.logger.log(`Interval job "${name}" has been restarted with ${interval}ms.`)
  }

  getCronJobs() {
    const result: CreateCronJobDto[] = []
    const jobs = this.schedulerRegistry.getIntervals()
    jobs.forEach((key) => {
      const data = this.jobData.get(key)

      const cronJob = plainToInstance(CreateCronJobDto, data, {
        excludeExtraneousValues: true
      })

      result.push(cronJob)
      this.logger.log(`Cron job: ${key}, Data: ${JSON.stringify(data)}`)
    })
    return result
  }
}
