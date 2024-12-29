import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CronJobService } from './cron-job.service'
import { CreateCronJobDto } from './dto/create-cron-job.dto'

@Controller('cron')
export class CronJobController {
  constructor(private readonly cronService: CronJobService) {}

  @Get()
  getCronJobs(): CreateCronJobDto[] {
    return this.cronService.getCronJobs()
  }

  @Post()
  addCronJob(@Body() body: { name: string; time: number; apiKey: string; apiSecret: string }) {
    const { name, time, apiKey, apiSecret } = body

    const cronJobs = this.cronService.getCronJobs()
    if (cronJobs.find((cronJob) => cronJob.name === name)) throw new Error(`Cron job "${name}" already exists`)

    this.cronService.addCronJob(name, time, apiKey, apiSecret)
    return `Cron job "${name}" has been added with time "${time}" and data value1="${apiKey}", value2="${apiSecret}"`
  }

  @Delete(':name')
  deleteCronJob(@Param('name') name: string) {
    this.cronService.deleteCronJob(name)
    return `Cron job "${name}" has been deleted`
  }

  @Patch(':name/stop')
  stopCronJob(@Param('name') name: string) {
    this.cronService.stopIntervalJob(name)
    return `Cron job "${name}" has been deleted`
  }

  @Patch(':name/start')
  restartCronJob(@Param('name') name: string) {
    this.cronService.restartIntervalJob(name)
    return `Cron job "${name}" has been deleted`
  }
}
