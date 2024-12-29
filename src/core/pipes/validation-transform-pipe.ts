import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class TransformAndValidatePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata

    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    // Thực hiện chuyển đổi dữ liệu
    const object = plainToInstance(metatype, value, {
      excludeExtraneousValues: true // Loại bỏ các trường không được @Expose
    })

    // Kiểm tra dữ liệu
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new Error('Validation failed')
    }

    return object // Trả về đối tượng sau khi đã chuyển đổi
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
