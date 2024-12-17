import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'

@Injectable()
export class IpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    return !!user || !user
  }
}
