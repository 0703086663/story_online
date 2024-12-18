import { Controller, Post, ParseFilePipe, FileTypeValidator, UploadedFiles, Get, Param, Res } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger'
import { FileService } from './file.service'
import { Response } from 'express'
import { GetResponse, Upload } from '@/commons'

@ApiTags('file')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @Upload('files')
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.fileService.uploadFiles(files)
  }
  @Get(':fileName/download')
  async download(@Param('fileName') fileName: string, @Res() response: Response): Promise<void> {
    await this.fileService.downloadFile(fileName, response)
  }

  @Get(':fileName')
  @GetResponse('Link')
  getLink(@Param('fileName') fileName: string) {
    return this.fileService.getPresignedUrl(fileName)
  }
}
