import { Module } from '@nestjs/common'
import { CrawlerController } from './crawler.controller'
import { CrawlerService } from './crawler.service'
import { PrismaModule } from '@/modules/prisma/prisma.module'

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
  imports: [PrismaModule],
  exports: [CrawlerService],
})
export class CrawlerModule {}
