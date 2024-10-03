import { PrismaModule } from 'src/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { ChapterService } from './chapter.service'
import { ChapterController } from './chapter.controller'

@Module({
  controllers: [ChapterController],
  providers: [ChapterService],
  imports: [PrismaModule],
  exports: [ChapterService],
})
export class ChapterModule {}
