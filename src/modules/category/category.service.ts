import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { CategoryDto } from './category.dto'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { IFilter } from '@/commons'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(categoryDto: CategoryDto) {
    if (!categoryDto.name) throw new BadRequestException('Name cannot be null')

    try {
      return await this.prisma.category.create({
        data: {
          name: categoryDto.name.trim(),
          description: categoryDto.description.trim(),
        },
      })
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.[0] === 'name') {
        throw new UnprocessableEntityException('Name is already taken')
      }
      throw new Error(err)
    }
  }

  async findAll(filter?: IFilter) {
    const categories = await this.prisma.category.findMany({ ...filter })
    const count = await this.prisma.category.count({ where: { ...filter.where } })
    return { data: categories, count }
  }

  async findOne(id: number, filter?: IFilter) {
    const result = await this.prisma.category.findFirst({ where: { id }, ...filter })
    if (!result) throw new NotFoundException(`Category with ID ${id} not found`)
    return result
  }

  async update(id: number, categoryDto: CategoryDto) {
    if (!categoryDto.name) throw new BadRequestException('Name cannot be null')

    const existingCategory = await this.prisma.category.findUnique({ where: { id } })
    if (!existingCategory) throw new NotFoundException(`Category with ID ${id} not found`)

    try {
      return await this.prisma.category.update({
        where: { id },
        data: categoryDto,
      })
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.[0] === 'name') {
        throw new UnprocessableEntityException('Name is already taken')
      }
      throw new Error(err)
    }
  }

  async remove(id: number) {
    const existingCategory = await this.prisma.category.findUnique({ where: { id } })
    if (!existingCategory) throw new NotFoundException(`Category with ID ${id} not found`)
    return this.prisma.category.delete({ where: { id } })
  }
}
