import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Ip } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotModifiedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import {
  Authorization,
  DeleteResponse,
  GetResponse,
  IpGuard,
  OwnerAuthorization,
  PatchResponse,
  PostResponse,
  User,
} from '@/commons'
import { ProductService } from './product.service'
import { ChapterService } from '@/modules/chapter/chapter.service'
import { RateService } from '@/modules/rate/rate.service'

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly chapterService: ChapterService,
    private readonly rateService: RateService,
  ) {}

  @Authorization()
  @Post()
  @PostResponse('product')
  create(@User('id') userId: number, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(userId, createProductDto)
  }

  @Get()
  @GetResponse('Product')
  @ApiOkResponse({ description: 'Products retrieved successfully' })
  findAll() {
    return this.productService.findAll()
  }

  @Get(':id')
  @GetResponse('Product')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id)
  }

  @Get(':id/rate')
  @GetResponse('Rate')
  async findRate(@Param('id') id: string) {
    return await this.rateService.findAllByProductId(+id)
  }

  @Get(':id/chapter')
  @GetResponse('Chapters')
  async findChapter(@Param('id') id: string) {
    const chapters = await this.chapterService.findAll()
    return chapters.filter(chap => chap.productId === +id)
  }

  @Get(':id/chapter/:chapterNumber')
  @GetResponse('Chapter')
  findOneChapter(@Param('id') id: string, @Param('chapterNumber') chapterNumber: string) {
    return this.productService.findOneChapter(+id, +chapterNumber)
  }

  @OwnerAuthorization('product')
  @Patch(':id')
  @PatchResponse('Product')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto)
  }

  @Authorization()
  @Delete(':id')
  @DeleteResponse('Product')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id)
  }

  @Post(':id/view')
  @UseGuards(IpGuard)
  @ApiCreatedResponse({ description: 'Product view increased' })
  @ApiNotModifiedResponse({ description: 'View not updated' })
  async incrementView(@User('id') userId: string, @Param('id') id: string, @Ip() ip: string) {
    return await this.productService.incrementViewCount(+id, ip, userId ? +userId : null)
  }
}
