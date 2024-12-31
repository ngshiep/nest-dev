import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ValidationError } from 'class-validator'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './core/filters/http-exception.filter'
import { ResponseFormatInterceptor } from './core/interceptors/response-format.interceptor'
import { UnprocessableEntityException } from './core/interceptors/unprocessable-entity.exception'
import { TransformAndValidatePipe } from './core/pipes/validation-transform-pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH'
  })
  app.useGlobalPipes(new TransformAndValidatePipe())
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            [error.property]: Object.values(error.constraints).join(', ')
          }))
        )
      },
      stopAtFirstError: true
    })
  )

  app.useGlobalInterceptors(new ResponseFormatInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
