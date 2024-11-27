import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { ChapterModule } from '../chapter/chapter.module'
import { RateModule } from '../rate/rate.module'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, ChapterModule, RateModule],
})
export class ProductModule {}
