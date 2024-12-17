import { Module } from '@nestjs/common'
import { RateService } from './rate.service'
import { RateController } from './rate.controller'
import { PrismaModule } from '@/modules/prisma/prisma.module'

@Module({
  controllers: [RateController],
  providers: [RateService],
  imports: [PrismaModule],
  exports: [RateService],
})
export class RateModule {}
