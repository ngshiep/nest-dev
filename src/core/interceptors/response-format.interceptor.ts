import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { isIResponse } from 'src/utils/checkResponse'

interface Response<T> {
  data: T
  message: string
  isSuccess: boolean
}

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const isRes = isIResponse(data)
        if (isRes) {
          return {
            data: data.data || null,
            message: data.message || 'Request processed successfully',
            isSuccess: true
          }
        }
        return {
          data: data?.data ? data?.data : data || null,
          message: 'Request processed successfully',
          isSuccess: true
        }
      })
    )
  }
}
