import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard, RolesGuard } from '../guards'
import { ROLE } from '../enums'

/**
 * @example ```@Authorization()``` - For check login
 * @example ```@Authorization(ROLE.MANAGER)``` - For manager
 * @example ```@Authorization(ROLE.ADMIN)``` - For admin
 */
export function Authorization(...roles: ROLE[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'No permission' }),
  )
}
