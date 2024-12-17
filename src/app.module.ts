import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '@/modules/auth/auth.module'
import { CategoryModule } from '@/modules/category/category.module'
import { ChapterModule } from '@/modules/chapter/chapter.module'
import { CommentModule } from '@/modules/comment/comment.module'
import { CrawlerModule } from '@/modules/crawler/crawler.module'
import { ListModule } from '@/modules/list/list.module'
import { PaymentModule } from '@/modules/payment/payment.module'
import { PrismaModule } from '@/modules/prisma/prisma.module'
import { ProductModule } from '@/modules/product/product.module'
import { RateModule } from '@/modules/rate/rate.module'
import { FileModule } from '@/modules/file/file.module'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
    CategoryModule,
    ChapterModule,
    CommentModule,
    CrawlerModule,
    ListModule,
    PaymentModule,
    PrismaModule,
    ProductModule,
    RateModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
