import { ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { ValidationError } from 'class-validator'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './core/filters/all-exception.filter'
import { HttpExceptionFilter } from './core/filters/http-exception.filter'
import { ResponseFormatInterceptor } from './core/interceptors/response-format.interceptor'
import { UnprocessableEntityException } from './core/interceptors/unprocessable-entity.exception'
import { JwtAuthGuard } from './modules/auth/decorators/jwt-auth.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH'
  })

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()))
  // app.useGlobalPipes(new TransformAndValidatePipe())
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

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
