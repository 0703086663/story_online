import { Module } from '@nestjs/common'
import { ListController } from './list.controller'
import { ListService } from './list.service'
import { PrismaModule } from '@/modules/prisma/prisma.module'

@Module({
  controllers: [ListController],
  providers: [ListService],
  imports: [PrismaModule],
  exports: [ListService],
})
export class ListModule {}
