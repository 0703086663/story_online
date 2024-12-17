import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLE } from '../enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (user && user.role === ROLE.ADMIN) return true

    const roles = this.reflector.get<ROLE[]>('roles', context.getHandler())

    if (!roles || roles.length === 0) return true

    return roles.some(role => user.role === role)
  }
}
