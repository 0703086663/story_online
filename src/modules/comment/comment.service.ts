import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CommentDto } from './comment.dto'
import { IFilter } from '@/commons'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(commentDto: CommentDto) {
    if (!commentDto.content) throw new BadRequestException('Content cannot be null')

    try {
      return await this.prisma.comment.create({
        data: {
          createdBy: +commentDto.userId,
          productId: +commentDto.productId,
          content: commentDto.content.trim(),
        },
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async findAllByProductId(productId: number) {
    return await this.prisma.comment.findMany({
      where: { productId },
    })
  }

  async findAll(filter?: IFilter) {
    return await this.prisma.comment.findMany({ ...filter })
  }

  async update(id: number, commentDto: CommentDto) {
    if (!commentDto.content) throw new BadRequestException('Content cannot be null')

    try {
      return await this.prisma.comment.update({
        where: { id },
        data: {
          content: commentDto.content.trim(),
        },
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async remove(id: number) {
    return await this.prisma.comment.delete({
      where: { id },
    })
  }
}
