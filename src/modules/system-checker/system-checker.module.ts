import { Module } from '@nestjs/common'
import { SystemCheckerController } from './system-checker.controller'
import { SystemCheckerService } from './system-checker.service'

@Module({
  controllers: [SystemCheckerController],
  providers: [SystemCheckerService]
})
export class SystemCheckerModule {}
