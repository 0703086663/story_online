import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RateService } from './rate.service'
import { RateDto, UpdateRateDto } from './rate.dto'
import { Authorization, DeleteResponse, GetResponse, PatchResponse, PostResponse, User } from 'src/common'

@ApiTags('rate')
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Authorization()
  @Post()
  @PostResponse('Rate')
  create(@User('id') userId: string, @Body() createRateDto: RateDto) {
    return this.rateService.create(+userId, createRateDto)
  }

  @Get(':id')
  @GetResponse('Rate')
  findAllByProductId(@Param('id') id: string) {
    return this.rateService.findOne(+id)
  }

  @Authorization()
  @Patch(':id')
  @PatchResponse('Rate')
  update(@User('id') userId: string, @Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.rateService.update(+userId, +id, updateRateDto)
  }

  @Authorization()
  @Delete(':id')
  @DeleteResponse('Rate')
  remove(@User('id') userId: string, @Param('id') id: string) {
    return this.rateService.remove(+userId, +id)
  }
}
