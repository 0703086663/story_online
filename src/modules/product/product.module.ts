import { Module } from '@nestjs/common'
import { PrismaModule } from '@/modules/prisma/prisma.module'
import { ChapterModule } from '@/modules/chapter/chapter.module'
import { RateModule } from '@/modules/rate/rate.module'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, ChapterModule, RateModule],
  exports: [ProductService],
})
export class ProductModule {}
