import { ApiProperty } from '@nestjs/swagger'

export class TruyenHdDto {
  @ApiProperty({
    description: 'Link of website',
    example: 'https://truyenhdx.com/truyen/benh-my-nhan-bao-hong-trong-show-tre-em/',
  })
  uri: string
}

export class TruyenFullDto {
  @ApiProperty({
    description: 'Link of website',
    example: 'https://truyenfull.vn/thap-nien-90-nuoi-chong-tu-tam-be/',
  })
  uri: string
}

export class JjwrcDto {
  @ApiProperty({
    description: 'Link of website',
    example: 'https://www.jjwxc.net/onebook.php?novelid=2530',
  })
  uri: string
}

export class CozyDto {
  @ApiProperty({
    description: 'Link of website',
    example: 'https://cozynovel.xyz/truyen/ca-khong-co-chan/chuong-16-dai-gia-nhan-tu/',
  })
  uri: string
}
