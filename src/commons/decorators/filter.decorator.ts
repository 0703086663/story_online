import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { IFilter } from '../interfaces'

export const Filter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const { take, skip, where, include, select, orderBy } = request.query

    try {
      let normalizedFilter: IFilter = {}
      if (where) normalizedFilter.where = JSON.parse(where)
      if (Number(take)) normalizedFilter.take = Number(take)
      if (Number(skip)) normalizedFilter.skip = Number(skip)
      if (include) normalizedFilter.include = JSON.parse(include)
      if (orderBy) normalizedFilter.orderBy = JSON.parse(orderBy)
      // Just use Include or Select
      if (select && include === 0) normalizedFilter.select = JSON.parse(select)

      return normalizedFilter
    } catch (error) {
      console.error('Invalid filter query:', error)
      return {}
    }
  },
  [
    (target, key, index) => {
      const explicit = Reflect.getMetadata(DECORATORS.API_PARAMETERS, target[key]) ?? []
      const example = `{
  "where": { "field": "value" },
  "take": 20,
  "skip": 0,
  "include": { "field": true },
  "orderBy": { "field": "asc" },
  "select": { "field": "value" }
}`

      Reflect.defineMetadata(
        DECORATORS.API_PARAMETERS,
        [
          ...explicit,
          {
            in: 'query',
            name: 'filter',
            required: false,
            type: 'object',
            example,
          },
        ],
        target[key],
      )
    },
  ],
)
