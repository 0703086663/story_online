import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpRequest')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        const logMessage = this.buildLogMessage(req, res, now)
        req.url && this.logger.log(logMessage)
      }),
      catchError(err => {
        const logMessage = this.buildLogMessage(req, res, now, err.status)
        if (err.status < 400) this.logger.warn(`${logMessage} | \x1b[33m[Warn] - ${err.message}\x1b[33m`)
        else req.url && this.logger.error(`${logMessage} | \x1b[31m[Error] - ${err.message}\x1b[31m`)
        throw err
      }),
    )
  }

  private buildLogMessage(req: any, res: any, now: number, statusCode?: number): string {
    const logParts = [
      `[${req.method}] - ${req.url}`,
      req.query && Object.keys(req.query).length ? `[Query] - ${JSON.stringify(req.query)}` : '',
      req.params && Object.keys(req.params).length ? `[Params] - ${JSON.stringify(req.params)}` : '',
      req.body && Object.keys(req.body).length ? `[Body] - ${JSON.stringify(req.body)}` : '',
      `\x1b[36m${req.ip}\x1b[36m`,
      `${this._color(statusCode ?? res.statusCode)} \x1b[33m+${Date.now() - now} ms\x1b[33m`,
    ]

    return logParts.filter(part => part).join(' | ')
  }

  private _color(statusCode: number): string {
    const green = '\x1b[32m'
    const yellow = '\x1b[33m'
    const red = '\x1b[31m'
    const reset = '\x1b[0m'

    if (statusCode >= 200 && statusCode < 300) {
      return `${green}${statusCode}${reset}`
    } else if (statusCode >= 300 && statusCode < 400) {
      return `${yellow}${statusCode}${reset}`
    } else if (statusCode >= 400) {
      return `${red}${statusCode}${reset}`
    }

    return `${statusCode}`
  }
}
