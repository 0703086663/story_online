import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaModule } from '@/modules/prisma/prisma.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
