import { ApiProperty, PickType } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'
import { InheritCategoryDto } from '@/modules/category/category.dto'
import { STATE, STATUS } from '@/commons/enums'

export class ProductDto {
  @ApiProperty({ required: false, default: 1 })
  id?: number

  @ApiProperty({
    description: 'Name of book',
    example: faker.commerce.productName(),
  })
  name: string

  @ApiProperty({
    required: false,
    description: 'Description of book',
    example: faker.commerce.productDescription(),
  })
  description?: string | null

  @ApiProperty({
    description: 'Source of book',
    example: 'Sưu tầm',
  })
  source: string

  @ApiProperty({
    description: 'Image of book',
    example: faker.image.url(),
  })
  image: string

  @ApiProperty({
    required: false,
    description: 'STATE of book: ACTIVE | INACTIVE',
    example: 'ACTIVE',
  })
  state?: STATE

  @ApiProperty({
    required: false,
    description: 'Status of book: PROGRESS | DONE',
    example: 'PROGRESS',
  })
  status?: STATUS

  @ApiProperty({
    description: 'Author of book',
    example: faker.person.fullName(),
  })
  authorName: string

  @ApiProperty({ required: false, default: 0 })
  viewCount?: number

  @ApiProperty({ required: true, default: 1 })
  userId: number

  @ApiProperty()
  User?: {
    connect: {
      id: number
    }
  }

  @ApiProperty({ type: () => [InheritCategoryDto] })
  categories: InheritCategoryDto[]
}

export class InheritProductDto extends PickType(ProductDto, ['id']) {}

export class CreateProductDto extends PickType(ProductDto, [
  'name',
  'description',
  'source',
  'image',
  'authorName',
  'categories',
]) {}

export class UpdateProductDto extends PickType(ProductDto, [
  'name',
  'description',
  'source',
  'image',
  'status',
  'authorName',
  'categories',
]) {}
