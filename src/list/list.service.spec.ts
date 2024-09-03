import { PrismaService } from 'src/prisma/prisma.service'
import { Test, TestingModule } from '@nestjs/testing'
import { ListService } from './list.service'

describe('ListService', () => {
  let service: ListService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListService, PrismaService],
    }).compile()

    service = module.get<ListService>(ListService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
