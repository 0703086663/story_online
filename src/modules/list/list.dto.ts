import { ApiProperty, PickType } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'
import { InheritProductDto } from '@/modules/product/product.dto'
import { InheritChapterDto } from '@/modules/chapter/chapter.dto'
import { CLASSIFICATION } from '@/commons'

export class ListDto {
  @ApiProperty({ required: false, default: 1 })
  id?: number

  @ApiProperty({ required: true, default: 1 })
  createdBy: number

  @ApiProperty({
    required: true,
    description: 'Classification of list',
    example: faker.helpers.arrayElement(['READING', 'FAVORITE']),
  })
  classification: CLASSIFICATION

  @ApiProperty({ type: () => [InheritProductDto] })
  products: InheritProductDto[]

  @ApiProperty({ type: () => [InheritChapterDto] })
  chapters: InheritChapterDto[]

  @ApiProperty()
  user?: {
    connect: {
      id: number
    }
  }
}

export class UpdateListDto extends PickType(ListDto, ['classification', 'chapters', 'products']) {}
