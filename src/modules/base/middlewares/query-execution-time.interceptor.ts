import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class QueryExecutionTimeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now()

        const request = context.switchToHttp().getRequest()
        const method = request.method
        const url = request.url

        return next.handle().pipe(
            tap(() => {
                const timeTaken = Date.now() - now
                Logger.verbose(
                    `Route: ${method} ${url} - Query Execution Time: ${timeTaken}ms`,
                )
            }),
        )
    }
}
