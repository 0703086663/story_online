import { ApiProperty, PickType } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'
import { STATE } from 'src/common'

function _generateHtmlContent(paragraphCount: number): string {
  const paragraphs = []
  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(`<p>${faker.lorem.paragraph()}</p>`)
  }
  return paragraphs.join('<br />')
}

export class ChapterDto {
  @ApiProperty({ required: false, default: 1 })
  id?: number

  @ApiProperty({ required: true, default: 1 })
  productId: number

  @ApiProperty({
    required: true,
    description: 'Name of chapter',
    example: faker.commerce.productName(),
  })
  chapterName: string

  @ApiProperty({
    required: true,
    description: 'Content of book',
    example: _generateHtmlContent(50),
  })
  content: string

  @ApiProperty({
    required: false,
    description: 'STATE of chapter: ACTIVE | INACTIVE',
    example: 'ACTIVE',
  })
  state?: STATE

  @ApiProperty({
    required: true,
    default: 1,
  })
  chapterNumber: number

  @ApiProperty({
    required: false,
    default: 0,
    example: faker.finance.amount({ min: 10, max: 100, dec: 2 }),
  })
  price?: number

  @ApiProperty()
  Product?: {
    connect: {
      id: number
    }
  }
}

export class InheritChapterDto extends PickType(ChapterDto, ['id']) {}

export class CreateChapterDto extends PickType(ChapterDto, [
  'productId',
  'chapterName',
  'content',
  'chapterNumber',
  'price',
]) {}

export class UpdateChapterDto extends PickType(ChapterDto, ['chapterName', 'content', 'chapterNumber', 'price']) {}
