import { Controller, Get } from '@nestjs/common'
import { BinanceService } from './binance.service'

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('account-info')
  getAccountInfo() {
    return this.binanceService.getFuturesWalletBalance()
  }
}
