import { BadRequestException, Injectable } from '@nestjs/common'
import { CLASSIFICATION, IFilter } from '@/commons'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { UpdateListDto } from './list.dto'

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async findAll(createdBy: number, filter?: IFilter) {
    const classification = filter?.where?.classification

    if (classification && ![CLASSIFICATION.FAVORITE, CLASSIFICATION.READING].includes(classification)) {
      throw new BadRequestException('Invalid classification provided')
    }

    try {
      const lists = await this.prisma.list.findMany({
        select: {
          id: true,
          classification: true,
          createdBy: true,
          updatedAt: true,
          chapters: classification !== CLASSIFICATION.FAVORITE ? { include: { product: true } } : false,
          products: classification !== CLASSIFICATION.READING,
        },
        ...filter,
        where: { createdBy, ...filter?.where },
      })
      const count = await this.prisma.list.count({ where: { createdBy, ...filter?.where } })

      return { data: lists, count }
    } catch (err) {
      throw err
    }
  }

  async update(createdBy: number, updateListDto: UpdateListDto) {
    const { classification, chapters, products } = updateListDto

    if (![CLASSIFICATION.FAVORITE, CLASSIFICATION.READING].includes(classification)) {
      throw new BadRequestException('Invalid classification provided')
    }

    try {
      const existingList = await this.prisma.list.findFirst({
        where: { createdBy, classification },
        include: classification === CLASSIFICATION.READING ? { chapters: true } : { products: true },
      })

      if (classification === CLASSIFICATION.FAVORITE && (!products || products.length === 0)) {
        throw new BadRequestException("Products can't be null")
      }

      if (classification === CLASSIFICATION.READING && (!chapters || chapters.length === 0)) {
        throw new BadRequestException("Chapters can't be null")
      }

      const entity = classification === CLASSIFICATION.FAVORITE ? products : chapters
      const entityField = classification === CLASSIFICATION.FAVORITE ? 'products' : 'chapters'

      const existingEntityIds = existingList?.[entityField].map(e => e.id) || []
      const entitiesToConnect = entity.filter(e => !existingEntityIds.includes(e.id))
      const entitiesToDisconnect = entity.filter(e => existingEntityIds.includes(e.id))

      return await this.prisma.list.upsert({
        where: { createdBy_classification: { createdBy, classification } },
        create: {
          createdBy,
          classification,
          [entityField]: { connect: entity.map(e => ({ id: e.id })) },
        },
        update: {
          [entityField]: {
            connect: entitiesToConnect.map(e => ({ id: e.id })),
            disconnect: entitiesToDisconnect.map(e => ({ id: e.id })),
          },
        },
        select: {
          id: true,
          classification: true,
          createdBy: true,
          [entityField]: true,
        },
      })
    } catch (err) {
      throw err
    }
  }
}
