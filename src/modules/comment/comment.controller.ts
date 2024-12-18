import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { CommentDto } from './comment.dto'
import { Authorization, DeleteResponse, GetResponse, PatchResponse, PostResponse } from '@/commons'

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
  findAll() {
    return this.commentService.findAll()
  }

  @Get(':productId')
  @GetResponse('Chapter')
  indAllByProductId(@Param('productId') productId: string) {
    return this.commentService.findAllByProductId(+productId)
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
