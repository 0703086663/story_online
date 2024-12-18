import { faker } from '@faker-js/faker'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { InheritChapterDto } from '@/modules/chapter/chapter.dto'

export class PaymentDto {
  @ApiProperty({ required: true, default: 1 })
  userId: number

  @ApiProperty({
    required: true,
    description: 'Amount of the payment',
    minimum: 50,
    type: 'number',
    example: faker.finance.amount({ min: 50, max: 100, dec: 0 }),
  })
  amount: number

  @ApiProperty()
  user?: {
    connect: {
      id: number
    }
  }

  @ApiProperty({ type: () => [InheritChapterDto] })
  chapters: InheritChapterDto[]
}

export class CreatePaymentDto extends PickType(PaymentDto, ['userId', 'amount', 'chapters']) {}

export class IntentDto {
  @ApiProperty({
    required: true,
    description: 'Amount of transaction (must be integer)',
    default: 0,
    minimum: 50,
    example: faker.finance.amount({ min: 50, max: 100, dec: 0 }),
  })
  amount: number

  @ApiProperty({
    required: false,
    description: 'Description',
    example: faker.commerce.productDescription(),
  })
  description?: string
}
