import * as Crawler from 'crawler'

export const crawling = (uri: string, callback: (cheerio: cheerio.CheerioAPI) => any) => {
  return new Promise<any>((resolve, reject) => {
    const crawler = new Crawler({
      maxConnections: 10,
      callback: (error: Error, res: Crawler.CrawlerRequestResponse, done: () => void) => {
        if (error) {
          done()
          reject(error)
          return
        }

        try {
          const result = callback(res.$)
          done()

          resolve(result)
        } catch (err) {
          reject(err)
        }
      },
    })

    crawler.queue({
      uri,
    })
  })
}
