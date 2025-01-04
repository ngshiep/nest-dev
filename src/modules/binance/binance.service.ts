import { Injectable, Logger } from '@nestjs/common'
import binance, { Binance } from 'binance-api-node'
import * as https from 'https'

@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name)
  private readonly binance: Binance
  private readonly channelId = process.env.TELEGRAM_CHAT_ID
  private readonly telegramToken = process.env.TELEGRAM_API_TOKEN
  private readonly apiKey = process.env.API_KEY
  private readonly apiSecret = process.env.API_SECRET

  constructor() {
    this.binance = binance({
      apiKey: this.apiKey,
      apiSecret: this.apiSecret
    })
  }

  async getFuturesWalletBalance() {
    try {
      const futuresAccountInfo = await this.binance.futuresAccountInfo()
      return futuresAccountInfo.totalMarginBalance
    } catch (error) {
      this.sendMessageToChannel('test server::: ' + error.message, this.channelId)
    }
  }
  async getFuturesWalletBalanceWithKey(apiKey: string, apiSecret: string) {
    try {
      const client = binance({
        apiKey,
        apiSecret
      })
      const futuresAccountInfo = await client.futuresAccountInfo()
      this.logger.warn(`Account Info executing at time (${futuresAccountInfo?.totalMarginBalance})`)
      return futuresAccountInfo.totalMarginBalance
    } catch (error) {
      this.logger.error(`test server:::  (${error.message})`)
      this.sendMessageToChannel('test server::: ' + error.message, this.channelId)
    }
  }
  async sendMessageToChannel(message: string, channelId: string): Promise<void> {
    const token = this.telegramToken
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${channelId}&text=${message}`

    try {
      await this.sendHttpRequest(url)
    } catch (error) {
      console.log('Lỗi khi gửi tin nhắn:', error.message)
    }
  }

  private sendHttpRequest(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode === 200) {
            resolve()
          } else {
            reject(new Error(`Failed to send message. Status Code: ${res}`))
          }
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  }
}

// // Lọc tài sản có số dư dương
// const balances = futuresAccountInfo.assets.filter((asset) => parseFloat(asset.walletBalance) > 0)

// // Trả về danh sách tài sản có số dư
// return balances.map((balance) => ({
//   asset: balance.asset,
//   walletBalance: parseFloat(balance.walletBalance)
// }))
