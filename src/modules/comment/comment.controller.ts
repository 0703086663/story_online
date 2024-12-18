import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { CommentDto } from './comment.dto'
import { Authorization, DeleteResponse, Filter, GetResponse, IFilter, PatchResponse, PostResponse } from '@/commons'

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Authorization()
  @Post()
  @PostResponse('Chapter')
  create(@Body() commentDto: CommentDto) {
    return this.commentService.create(commentDto)
  }

  @Get()
  @GetResponse('Chapters')
  findAll(@Filter() filter?: IFilter) {
    return this.commentService.findAll(filter)
  }

  @Get(':id')
  @GetResponse('Chapter')
  fineOne(@Param('id') id: string, @Filter() filter?: IFilter) {
    return this.commentService.findOne(+id, filter)
  }

  @Authorization()
  @Patch(':id')
  @PatchResponse('Chapter')
  update(@Param('id') id: string, @Body() commentDto: CommentDto) {
    return this.commentService.update(+id, commentDto)
  }

  @Authorization()
  @Delete(':id')
  @DeleteResponse('Chapter')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }
}
