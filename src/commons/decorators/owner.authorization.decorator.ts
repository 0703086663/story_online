import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { OwnerGuard } from '../guards'
import { Authorization } from './authorization.decorator'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

export function OwnerAuthorization(resourceName: string) {
  return applyDecorators(
    Authorization(),
    SetMetadata('resourceName', resourceName),
    UseGuards(OwnerGuard(resourceName)),

    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'No permission' }),
  )
}
