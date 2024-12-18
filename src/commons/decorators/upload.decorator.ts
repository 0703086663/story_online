import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'

/**
 * Upload multiple files
 * @param key - From form upload
 * @returns
 */
export function Upload(key: string = 'files') {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(key)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [key]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Upload file successfully' }),
  )
}
