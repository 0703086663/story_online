import { Module } from '@nestjs/common'
import { PrismaModule } from '@/modules/prisma/prisma.module'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [PrismaModule],
  exports: [PaymentService],
})
export class PaymentModule {}
