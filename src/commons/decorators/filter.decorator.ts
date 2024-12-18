export interface IFilter<T> {
  take?: Number
  skip?: Number
  where?: Record<keyof T | string, any>
  include?: Record<keyof T, boolean>
  orderBy?: Record<keyof T, 'asc' | 'desc'>
  select?: Record<keyof T, boolean>
}

import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { DECORATORS } from '@nestjs/swagger/dist/constants'

export const FilterParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log('----------data: ', data)
    const request = ctx.switchToHttp().getRequest()
    const { take, skip, where, include, select, orderBy } = request.query

    try {
      const parseBooleanRecord = (input: string) => {
        const parsed = JSON.parse(input)
        return Object.keys(parsed).reduce(
          (acc, key) => {
            acc[key] = Boolean(parsed[key])
            return acc
          },
          {} as Record<string, boolean>,
        )
      }

      let normalizedFilter: IFilter<any> = {}
      if (where) normalizedFilter.where = JSON.parse(where)
      if (Number(take)) normalizedFilter.take = Number(take)
      if (Number(skip)) normalizedFilter.skip = Number(skip)
      if (include) normalizedFilter.include = parseBooleanRecord(include)
      if (orderBy) normalizedFilter.orderBy = JSON.parse(orderBy)
      // Just use Include or Select
      if (select && include === 0) normalizedFilter.select = parseBooleanRecord(select)

      return normalizedFilter
    } catch (error) {
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
