import { BadRequestException, Injectable } from '@nestjs/common'
import { CLASSIFICATION, IFilter } from '@/commons'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { UpdateListDto } from './list.dto'

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async findAll(createdBy: number, classification?: CLASSIFICATION, filter?: IFilter) {
    try {
      if (classification && classification !== CLASSIFICATION.FAVORITE && classification !== CLASSIFICATION.READING) {
        throw new BadRequestException('Invalid classification provided')
      }

      const lists = await this.prisma.list.findMany({
        where: {
          ...(classification ? { classification } : {}),
          createdBy,
        },
        select: {
          id: true,
          classification: true,
          createdBy: true,
          updatedAt: true,
          chapters:
            classification === CLASSIFICATION.READING || classification === undefined
              ? { select: { id: true, productId: true, chapterName: true } }
              : false,
          products: classification === CLASSIFICATION.FAVORITE || classification === undefined ? true : false,
        },
        ...filter,
      })
      const count = await this.prisma.list.count({
        where: { ...(classification ? { classification } : {}), createdBy, ...filter.where },
      })

      return { data: lists, count }
    } catch (err) {
      throw err
    }
  }

  async update(createdBy: number, updateListDto: UpdateListDto) {
    const { classification, chapters, products } = updateListDto

    const productDetail = await this.prisma.product.findFirst({
      where: { id: products[0].id },
    })

    const existingList = await this.prisma.list.findFirst({
      where: { createdBy, classification },
      include: {
        chapters: true,
        products: true,
      },
    })

    try {
      if (!existingList) {
        return await this.prisma.list.create({
          data: {
            createdBy,
            classification,
            chapters:
              classification === CLASSIFICATION.READING
                ? {
                    connect: chapters.map(chapter => ({
                      id: chapter.id,
                    })),
                  }
                : undefined,
            products:
              classification === CLASSIFICATION.FAVORITE
                ? {
                    connect: products.map(product => ({
                      id: product.id,
                    })),
                  }
                : undefined,
          },
          select: {
            id: true,
            classification: true,
            createdBy: true,
            chapters: classification === CLASSIFICATION.READING ? true : false,
            products: classification === CLASSIFICATION.FAVORITE ? true : false,
          },
        })
      } else {
        const existedItem = existingList.products.map(v => v.id).includes(products[0].id)
        return await this.prisma.list.update({
          where: {
            id: existingList.id,
            createdBy,
            classification: classification,
          },
          data: {
            chapters:
              classification === CLASSIFICATION.READING
                ? {
                    set: chapters.map(chapter => ({
                      id: chapter.id,
                    })),
                  }
                : undefined,
            products:
              classification === CLASSIFICATION.FAVORITE
                ? {
                    set: existedItem
                      ? [...existingList.products.filter(v => v.id !== products[0].id)]
                      : [...existingList.products, productDetail],
                  }
                : undefined,
          },
          select: {
            id: true,
            classification: true,
            createdBy: true,
            updatedAt: true,
            chapters: classification === CLASSIFICATION.READING ? true : false,
            products: classification === CLASSIFICATION.FAVORITE ? true : false,
          },
        })
      }
    } catch (err) {
      throw err
    }
  }
}
