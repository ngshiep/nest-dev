import { HttpException, HttpStatus } from '@nestjs/common'

export class UnprocessableEntityException extends HttpException {
  constructor(errors: object | string) {
    super(
      {
        data: null,
        message: errors,
        isSuccess: false
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
