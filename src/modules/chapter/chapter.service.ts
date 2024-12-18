import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreateChapterDto, UpdateChapterDto } from './chapter.dto'
import { IFilter } from '@/commons'

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  async create(createChapterDto: CreateChapterDto) {
    if (!createChapterDto.productId) throw new BadRequestException('Product ID cannot be null')
    if (!createChapterDto.chapterName) throw new BadRequestException('Name cannot be null')
    if (!createChapterDto.content) throw new BadRequestException('Content cannot be null')
    if (!createChapterDto.chapterNumber) throw new BadRequestException('Chapter number cannot be null')

    try {
      return await this.prisma.chapter.create({
        data: {
          productId: +createChapterDto.productId,
          chapterName: createChapterDto.chapterName.trim(),
          content: createChapterDto.content.trim(),
          chapterNumber: +createChapterDto.chapterNumber,
          price: +createChapterDto.price,
        },
      })
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Chapter number must be unique for this product.')
      }
      throw new Error(err)
    }
  }

  async findAll(filter?: IFilter) {
    try {
      const chapters = await this.prisma.chapter.findMany({ ...filter })
      // const paymentHistories = await this.prisma.paymentHistory.findMany({
      //   include: {
      //     chapters: true,
      //   },
      // });

      // const userIdsByChapterId = {};

      // paymentHistories.forEach((paymentHistory) => {
      //   paymentHistory.chapters.forEach((chapter) => {
      //     if (!userIdsByChapterId[chapter.id]) {
      //       userIdsByChapterId[chapter.id] = [];
      //     }
      //     userIdsByChapterId[chapter.id].push(paymentHistory.userId);
      //   });
      // });

      // const chaptersWithUsers = paymentHistories.flatMap((paymentHistory) =>
      //   paymentHistory.chapters.map((chapter) => ({
      //     ...chapter,
      //     users: userIdsByChapterId[chapter.id] || [],
      //   })),
      // );

      return chapters
    } catch (err) {
      throw new Error(err)
    }
  }

  async findOne(id: number) {
    const result = await this.prisma.chapter.findUnique({
      where: { id },
    })

    if (!result) {
      throw new NotFoundException(`Chapter with ID ${id} not found`)
    }

    return result
  }

  async update(id: number, updateChapterDto: UpdateChapterDto) {
    const result = await this.prisma.chapter.findUnique({
      where: { id },
    })

    if (!result) {
      throw new NotFoundException(`Chapter with ID ${id} not found`)
    }

    try {
      return await this.prisma.chapter.update({
        where: { id },
        data: { ...updateChapterDto },
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async remove(id: number) {
    const result = await this.prisma.chapter.findUnique({
      where: { id },
    })

    if (!result) {
      throw new NotFoundException(`Chapter with ID ${id} not found`)
    }

    return this.prisma.chapter.delete({
      where: { id },
    })
  }
}
