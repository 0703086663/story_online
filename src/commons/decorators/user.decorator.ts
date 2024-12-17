import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * Add to params of route
 * @example ```async incrementView(@User('id') userId: string, @Param('id') id: string) {}```
 * @example ```@User('id') id: string```
 * @example ```@User() user: UserDto```
 */
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user

  return data ? user?.[data] : user
})
