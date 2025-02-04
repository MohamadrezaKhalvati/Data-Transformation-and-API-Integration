import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { UtilsService } from 'src/modules/utils/utils.service'

@Injectable()
export class ConvertNumberBodyInterceptor implements NestInterceptor {
    constructor(private readonly utilsService: UtilsService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const method = request.method

        if (method === 'POST') {
            request.body = this.transformRequestBody(request.body)
        }

        return next.handle()
    }

    private transformRequestBody(body: any): any {
        for (const bodyKey in body) {
            if (typeof bodyKey === 'string' || bodyKey === 'number')
                body[bodyKey] = this.utilsService.fixPersianNumber(
                    body[bodyKey],
                )
        }
        return body
    }
}
