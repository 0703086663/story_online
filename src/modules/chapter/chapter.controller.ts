import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChapterService } from './chapter.service'
import { CreateChapterDto, UpdateChapterDto } from './chapter.dto'
import { DeleteResponse, GetResponse, PatchResponse, PostResponse, Authorization } from '@/commons'

@ApiTags('chapter')
@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @Authorization()
  @PostResponse('Chapter')
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto)
  }

  @Get()
  @GetResponse('Chapters')
  findAll() {
    return this.chapterService.findAll()
  }

  @Get(':id')
  @GetResponse('Chapter')
  findOne(@Param('id') id: string) {
    return this.chapterService.findOne(+id)
  }

  @Patch(':id')
  @Authorization()
  @PatchResponse('Chapter')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.update(+id, updateChapterDto)
  }

  @Delete(':id')
  @Authorization()
  @DeleteResponse('Chapter')
  remove(@Param('id') id: string) {
    return this.chapterService.remove(+id)
  }
}
