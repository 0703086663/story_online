import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Post, Body } from '@nestjs/common'
import { CreatePaymentDto, IntentDto } from './payment.dto'
import { PaymentService } from './payment.service'
import { Authorization, PostResponse } from '@/commons'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Authorization()
  @Post('/createIntent')
  @PostResponse('Request')
  @ApiCreatedResponse({ description: 'Request sent' })
  async createIntent(@Body() intentDto: IntentDto) {
    try {
      const paymentResult = await this.paymentService.createIntent(intentDto)
      return { success: true, paymentResult }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Authorization()
  @Post()
  @PostResponse('Request')
  async storePayment(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const paymentResult = await this.paymentService.storePayment(createPaymentDto)
      return { success: true, paymentResult }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
