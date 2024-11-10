import { ApiProperty } from '@nestjs/swagger'
import { faker } from '@faker-js/faker'
import { InheritCommentDto } from '../comment/comment.dto'

export class UserDto {
  @ApiProperty({ required: false, default: 1 })
  id?: number

  @ApiProperty({
    description: 'Name of the user',
    example: faker.person.fullName(),
  })
  name: string

  @ApiProperty({
    required: false,
    description: 'Email of the user',
    example: faker.internet.email(),
  })
  email?: string

  @ApiProperty({
    required: false,
    description: 'Phone number of the user',
    example: faker.phone.number(),
  })
  phone?: string

  @ApiProperty({
    required: false,
    description: 'Birthdate of the user',
    example: faker.date.past(),
  })
  birthdate?: Date | null

  @ApiProperty({
    required: false,
    description: 'Profile image URL of the user',
    example: faker.image.avatar(),
  })
  image?: string

  //   @ApiProperty({
  //     required: false,
  //     description: 'Password of the user',
  //     example: 'securePassword123',
  //   })
  //   password?: string

  @ApiProperty({ required: false, default: 0 })
  money?: number

  @ApiProperty({ required: false })
  refreshToken?: string

  @ApiProperty({ default: false })
  emailVerified: boolean

  @ApiProperty({ type: () => [InheritCommentDto] })
  comments?: InheritCommentDto[]

  @ApiProperty({ type: () => [Number] })
  rates?: number[]

  @ApiProperty({ type: () => [Number] })
  products?: number[]

  @ApiProperty({ type: () => [Number] })
  lists?: number[]

  @ApiProperty({ type: () => [Number] })
  payments?: number[]

  @ApiProperty({ type: () => [Number] })
  views?: number[]
}
