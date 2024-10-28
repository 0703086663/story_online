import * as he from 'he'
import { aiTranslate, crawling } from 'src/common/utils'
import { STATUS } from 'src/common'
import { CozyDto, JjwrcDto, TruyenFullDto, TruyenHdDto } from './crawler.dto'
import { IChapter, IProduct } from 'src/common/interfaces'

export class CrawlerService {
  async fromTruyenhd(crawlerDto: TruyenHdDto) {
    try {
      const result: IProduct = await crawling(crawlerDto.uri, ($: cheerio.CheerioAPI) => {
        // Check last character of uri
        if (crawlerDto.uri.slice(-1) === '/') crawlerDto.uri = crawlerDto.uri.slice(0, -1)

        if (!$('div#views').attr('data-id')) return false

        // Get story information
        const id = $('div#views').attr('data-id').trim()
        const name = $('h1.crop-text-1').text().trim()
        const author = $('.table-column2.crop-text-1 a').text().trim()
        const chapterCount = $('a[href="#dsc"] span').text().trim()
        const image = $('.book3d img').attr('data-src').trim()
        const status =
          $('.table-column2.crop-text-1 span').text().trim() == 'Đang Cập Nhật' ? STATUS.PROGRESS : STATUS.DONE
        const description = $('.excerpt-full.hidden').text().trim()

        const newStory: IProduct = {
          id: +id,
          name,
          author,
          chapterCount: +chapterCount,
          image,
          status,
          description,
          chapters: [],
        }

        return newStory
      })

      if (result) {
        // Get chapter content - Break if paid content
        let foundContent = false
        for (let i = 1; i <= result.chapterCount; i++) {
          const uri = `${crawlerDto.uri}/chap/${result.id}-chuong-${i}/`

          await crawling(uri, ($: cheerio.CheerioAPI) => {
            const chapterName = $('h1.text-center').children().remove().end().text().trim()

            const element = $('.reading')
            element.find('*:not(br)').remove()

            // Check if VIP content
            if (element.html() && element.html() !== null && element.html().trim() !== '') {
              foundContent = true

              const chapter: IChapter = {
                productId: +result.id,
                chapterName,
                content: he.decode(element.html()),
                chapterNumber: i,
              }

              result.chapters.push(chapter)
            } else {
              foundContent = false
            }

            if (!foundContent) return false
          })
          if (!foundContent) {
            break
          }
        }
        return { data: result, message: 'Data found' }
      } else {
        return { data: null, message: 'Not found (Wrong uri or element)' }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async fromTruyenfull(crawlerDto: TruyenFullDto) {
    try {
      const result: IProduct = await crawling(crawlerDto.uri, ($: cheerio.CheerioAPI) => {
        // Check last character of uri
        if (crawlerDto.uri.slice(-1) === '/') crawlerDto.uri = crawlerDto.uri.slice(0, -1)

        if (!$('h3.title').text()) return false

        // Get story information
        const name = $('h3.title').text().trim()
        const author = $('.info a[itemprop="author"]').text().trim()
        const source = $('.info span.source').text().trim()
        const category = $('.info a[itemprop="genre"]').text().trim()
        const status = $('.info span.text-primary').text().trim() == 'Đang ra' ? STATUS.PROGRESS : STATUS.DONE

        var chapterCount = 0
        const canCountChapter = $('.l-chapter .l-chapters a').first().attr('title') ? true : false
        if (canCountChapter) {
          const chapterCountData = $('.l-chapter .l-chapters a').first().attr('title').trim()
          chapterCount = +chapterCountData.split(': ')[0].split(' ')[1]
        }

        const image = $('img[itemprop="image"]').first().attr('src')
        const description = $('div.desc-text').text().trim()

        const newStory: IProduct = {
          id: 0,
          name,
          author,
          chapterCount,
          image,
          status,
          source,
          description,
          chapters: [],
        }

        return newStory
      })

      if (result) {
        if (result.chapterCount === 0) {
          let i = 1
          let continueLoop = true
          do {
            let uri = `${crawlerDto.uri}/chuong-${i}/`
            await crawling(uri, ($: cheerio.CheerioAPI) => {
              const chapterName = $('a.chapter-title').text().trim()
              continueLoop = chapterName === '' || !chapterName ? false : true

              const element = $('div#chapter-c')
              element.find('*:not(p)').remove()

              // Check if content available
              if (element.html()) {
                const chapter: IChapter = {
                  chapterName,
                  content: he.decode(element.html()),
                  chapterNumber: i,
                }
                result.chapters.push(chapter)
              }
            })
            i++
          } while (continueLoop === true)
        } else {
          // Get chapter content
          for (let i = 1; i <= result.chapterCount; i++) {
            const uri = `${crawlerDto.uri}/chuong-${i}/`

            await crawling(uri, ($: cheerio.CheerioAPI) => {
              const chapterName = $('a.chapter-title').text().trim()

              const element = $('div#chapter-c')
              element.find('*:not(p)').remove()

              // Check if content available
              if (element.html()) {
                const chapter: IChapter = {
                  chapterName,
                  content: he.decode(element.html()),
                  chapterNumber: i,
                }
                result.chapters.push(chapter)
              }
            })
          }
        }
        return { data: result, message: 'Data found' }
      } else {
        return { data: null, message: 'Not found (Wrong uri or element)' }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async fromJjwrc(crawlerDto: JjwrcDto) {
    try {
      const result: IProduct = await crawling(crawlerDto.uri, async ($: cheerio.CheerioAPI) => {
        // Check last character of uri
        if (crawlerDto.uri.slice(-1) === '/') crawlerDto.uri = crawlerDto.uri.slice(0, -1)

        if (!$('#clickNovelid').text()) return false

        // Get story information
        const id = crawlerDto.uri.split('?novelid=')[1]
        const name = $('span[itemprop="articleSection"]').text().trim()
        const author = $('span[itemprop="author"]').text().trim()
        const category = $('span[itemprop="genre"]').text().trim()
        const chapterCount = $('tr[itemprop="chapter"]').last().find('td').first().text().trim()
        const image = $('img.noveldefaultimage[itemprop="image"]').attr('src').trim()
        const status = $('span[itemprop="updataStatus"] font').text().trim() == '完结' ? 'DONE' : 'PROGRESS'
        const description = $('div#novelintro').text().trim()

        const newStory: IProduct = {
          id: +id,
          name: await aiTranslate(name),
          author: await aiTranslate(author),
          chapterCount: +chapterCount,
          category: await aiTranslate(category),
          image,
          status,
          description: await aiTranslate(description),
          chapters: [],
        }

        return newStory
      })

      if (result) {
        // Get chapter content - Break if paid content
        let foundContent = true
        for (let i = 1; i <= result.chapterCount; i++) {
          const uri = `${crawlerDto.uri}&chapterid=${i}/`

          await crawling(uri, async ($: cheerio.CheerioAPI) => {
            const chapterName = $('div.novelbody div div h2').text().trim()

            const element = $('div.novelbody div')
            element.find('*:not(br)').remove()

            // Check if VIP content
            if (element.html() && element.html() !== null) {
              foundContent = true

              const chapter: IChapter = {
                chapterName: await aiTranslate(chapterName),
                content: await aiTranslate(he.decode(element.html())),
                chapterNumber: i,
              }

              result.chapters.push(chapter)
            } else {
              foundContent = false
            }

            if (!foundContent) return false
          })
          if (!foundContent) {
            break
          }
        }
        return { data: result, message: 'Data found' }
      } else {
        return { data: null, message: 'Not found (Wrong uri or element)' }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  async fromCozy(crawler: CozyDto) {
    const { uri } = crawler

    try {
      const result = {
        chapters: [],
      }

      await crawling(uri, ($: cheerio.CheerioAPI) => {
        const crawlName = $('h1#chapter-heading').text().trim()
        const chapterName = crawlName.split('-')[1].trim()

        const element = $('.reading-content .text-left')

        if (element.html()) {
          const chapter: IChapter = {
            chapterName,
            content: element
              .text()
              .replace(/[\n\t]+/g, ' ')
              .trim(),
            chapterNumber: +chapterName.split(':')[0].replace(/\D/g, ''),
          }
          result.chapters.push(chapter)
        }
      })
      return { data: result, message: 'Data found' }
    } catch (err) {
      throw new Error(err)
    }
  }
}
