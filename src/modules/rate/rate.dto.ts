import { ApiProperty, PickType } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'

export class RateDto {
  @ApiProperty({
    description: 'Id of product',
    example: 1,
  })
  productId: string
  @ApiProperty({
    description: 'Rate for product',
    example: faker.number.int({ min: 1, max: 5 }),
  })
  rating: number
}

export class UpdateRateDto extends PickType(RateDto, ['rating']) {}
