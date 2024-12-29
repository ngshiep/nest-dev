import { Injectable } from '@nestjs/common'
import * as si from 'systeminformation'

@Injectable()
export class SystemCheckerService {
  async getSystemInfo() {
    const cpuLoad = await si.currentLoad()
    const mem = await si.mem()

    return {
      cpuUsagePercent: Math.round(cpuLoad.currentLoad), // % CPU usage tổng (all cores)
      memoryUsagePercent: Math.round((mem.active / mem.total) * 100)
    }
  }
}
