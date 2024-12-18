import { ApiProperty, PickType } from '@nestjs/swagger'
import { STATE } from '@/commons'

export class CategoryDto {
  @ApiProperty({
    required: false,
    default: 1,
  })
  id?: number

  @ApiProperty({
    description: 'Name of the category',
    example: 'Kiếm hiệp',
  })
  name: string

  @ApiProperty({
    required: false,
    description: 'STATE of category: ACTIVE | INACTIVE',
    example: 'ACTIVE',
  })
  state?: STATE

  @ApiProperty({
    description: 'Description of the category',
    example: 'Đánh nhau gay gấn',
    required: false,
  })
  description?: string
}

export class InheritCategoryDto extends PickType(CategoryDto, ['id']) {}

export class CreateCategoryDto extends PickType(CategoryDto, ['name', 'description']) {}
