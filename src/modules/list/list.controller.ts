import { Controller, Get, Body, Patch, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ListService } from './list.service'
import { UpdateListDto } from './list.dto'
import { CLASSIFICATION, GetResponse, PatchResponse, Filter, IFilter, OwnerAuthorization, User } from '@/commons'

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @OwnerAuthorization('list')
  @Get('/')
  @GetResponse('List')
  findAllReading(
    @User('id') userId: string,
    @Query('classification') classification?: CLASSIFICATION,
    @Filter() filter?: IFilter,
  ) {
    return this.listService.findAll(+userId, classification, filter)
  }

  @OwnerAuthorization('list')
  @Patch()
  @PatchResponse('List')
  update(@User('id') userId: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(+userId, updateListDto)
  }
}
