import { Module } from '@nestjs/common'
import { ChapterController } from './chapter.controller'
import { ChapterService } from './chapter.service'
import { PrismaModule } from '@/modules/prisma/prisma.module'

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
  imports: [PrismaModule],
  exports: [ChapterService],
})
export class ChapterModule {}
