import { IChapter } from './chapter.interface'

export interface IProduct {
  id?: number
  name?: string
  author?: string
  chapterCount?: number
  category?: string
  image?: string
  status?: string
  source?: string
  description?: string
  chapters?: IChapter[]
}
