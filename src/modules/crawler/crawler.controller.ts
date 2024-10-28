import { Controller, Body, Post } from '@nestjs/common'
import { CrawlerService } from './crawler.service'
import { CozyDto, JjwrcDto, TruyenFullDto, TruyenHdDto } from './crawler.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('crawler')
@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('/truyenhd')
  fromTruyenHd(@Body() crawlerDto: TruyenHdDto) {
    return this.crawlerService.fromTruyenhd(crawlerDto)
  }

  @Post('/truyenfull')
  fromTruyenFull(@Body() crawlerDto: TruyenFullDto) {
    return this.crawlerService.fromTruyenfull(crawlerDto)
  }

  @Post('/jjwrc')
  fromJjwrc(@Body() crawlerDto: JjwrcDto) {
    return this.crawlerService.fromJjwrc(crawlerDto)
  }

  @Post('/cozy')
  fromCozy(@Body() crawlerDto: CozyDto) {
    return this.crawlerService.fromCozy(crawlerDto)
  }
}
