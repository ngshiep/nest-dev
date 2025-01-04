import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const status = exception instanceof HttpException ? exception.getStatus() : 500

    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    response.status(status).json({
      data: null,
      message: typeof message === 'string' ? message : (message as any).message || 'Error occurred',
      isSuccess: false
    })
  }
}
