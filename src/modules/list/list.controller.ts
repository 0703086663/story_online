import { Controller, Get, Body, Patch, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ListService } from './list.service'
import { UpdateListDto } from './list.dto'
import { CLASSIFICATION, GetResponse, PatchResponse, Authorization } from '@/commons'

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Authorization()
  @Get('/')
  @GetResponse('List')
  findAllReading(@Query('userId') userId: number, @Query('classification') classification: CLASSIFICATION) {
    return this.listService.findAll(userId, classification)
  }

  @Authorization()
  @Patch()
  @PatchResponse('List')
  update(@Body() updateListDto: UpdateListDto) {
    return this.listService.update(updateListDto)
  }
}
