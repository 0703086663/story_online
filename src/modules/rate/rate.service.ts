import { BadGatewayException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { RateDto, UpdateRateDto } from './rate.dto'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { IFilter } from '@/commons'

@Injectable()
export class RateService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, rateDto: RateDto) {
    if (!rateDto.rating) throw new BadGatewayException('Rating cannot be null')

    if (rateDto.rating != 1 && rateDto.rating != 2 && rateDto.rating != 3 && rateDto.rating != 4 && rateDto.rating != 5)
      throw new BadGatewayException('Rating should be from 1 to 5')

    try {
      return await this.prisma.rate.create({
        data: {
          createdBy: userId,
          productId: +rateDto.productId,
          rating: +rateDto.rating,
        },
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async findAll(filter?: IFilter) {
    const rates = await this.prisma.rate.findMany({ ...filter })
    const count = await this.prisma.rate.count()
    return { data: rates, count }
  }

  async findOne(id: number, filter?: IFilter) {
    return await this.prisma.rate.findFirst({ where: { id }, ...filter })
  }

  async update(userId: number, id: number, updateRateDto: UpdateRateDto) {
    if (!updateRateDto.rating) throw new BadGatewayException('Rating cannot be null')

    if (
      updateRateDto.rating != 1 &&
      updateRateDto.rating != 2 &&
      updateRateDto.rating != 3 &&
      updateRateDto.rating != 4 &&
      updateRateDto.rating != 5
    )
      throw new BadGatewayException('Rating should be from 1 to 5')

    try {
      return await this.prisma.rate.update({ where: { id }, data: { ...updateRateDto } })
    } catch (err) {
      throw new Error(err)
    }
  }

  async remove(userId: number, id: number) {
    return await this.prisma.rate.delete({
      where: { id, createdBy: userId },
    })
  }
}
