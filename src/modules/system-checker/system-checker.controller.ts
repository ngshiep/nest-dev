import { Controller, Get } from '@nestjs/common'
import { SystemCheckerService } from './system-checker.service'

@Controller('system-checker')
export class SystemCheckerController {
  constructor(private readonly systemService: SystemCheckerService) {}

  @Get('info')
  async getSystemInfo() {
    return this.systemService.getSystemInfo()
  }
}
