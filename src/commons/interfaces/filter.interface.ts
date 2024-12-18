export interface IFilter {
  take?: number
  skip?: number
  where?: Record<string, any>
  include?: Record<string, boolean | any>
  orderBy?: Record<string, 'asc' | 'desc' | any>
  select?: Record<string, boolean | any>
}
