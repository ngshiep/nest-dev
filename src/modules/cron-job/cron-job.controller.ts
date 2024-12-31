import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CronJobService } from './cron-job.service'
import { CronJobResponseDto } from './dto/cron-job-response.dto'

@Controller('cron')
export class CronJobController {
  constructor(private readonly cronService: CronJobService) {}

  @Get()
  getCronJobs(): CronJobResponseDto[] {
    return this.cronService.getCronJobs()
  }

  @Post()
  addCronJob(@Body() body) {
    const { name, time, apiKey, apiSecret } = body

    this.cronService.addCronJob(name, body)
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
