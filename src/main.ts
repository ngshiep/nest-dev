import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseFormatInterceptor } from './interceptors/response-format.interceptor';
import { UnprocessableEntityException } from './interceptors/unprocessable-entity.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            [error.property]: Object.values(error.constraints).join(', '),
          })),
        );
      },
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
