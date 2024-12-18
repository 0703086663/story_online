import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger'

export function GetResponse(name: string = 'Data') {
  return applyDecorators(
    ApiOkResponse({ description: `${name} retrieved successfully` }),
    ApiNotFoundResponse({ description: `Not found ${name}` }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
}

export function PostResponse(name: string = 'Data') {
  return applyDecorators(
    ApiCreatedResponse({ description: `${name} created successfully` }),
    ApiBadRequestResponse({ description: `Invalid input for ${name}` }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
}

export function PatchResponse(name: string = 'Data') {
  return applyDecorators(
    ApiOkResponse({ description: `${name} updated successfully` }),
    ApiBadRequestResponse({ description: `Invalid input for ${name}` }),
    ApiNotFoundResponse({ description: `Not found ${name}` }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
}

export function DeleteResponse(name: string = 'Data') {
  return applyDecorators(
    ApiOkResponse({ description: `${name} deleted successfully` }),
    ApiNotFoundResponse({ description: `Not found ${name}` }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  )
}
