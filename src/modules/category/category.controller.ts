import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './category.dto'
import { Authorization, DeleteResponse, GetResponse, PatchResponse, PostResponse, ROLE } from '@/commons'

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Authorization(ROLE.MANAGER)
  @Post()
  @PostResponse('Category')
  async create(@Body() categoryDto: CreateCategoryDto) {
    return await this.categoryService.create(categoryDto)
  }

  @Get()
  @GetResponse('Category')
  async findAll() {
    return await this.categoryService.findAll()
  }

  @Get(':id')
  @GetResponse('Category')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id)
  }

  @Authorization(ROLE.MANAGER)
  @Patch(':id')
  @PatchResponse('Category')
  async update(@Param('id') id: string, @Body() categoryDto: CreateCategoryDto) {
    return await this.categoryService.update(+id, categoryDto)
  }

  @Authorization(ROLE.MANAGER)
  @Delete(':id')
  @DeleteResponse('Category')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id)
  }
}
