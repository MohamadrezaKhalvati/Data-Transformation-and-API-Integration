import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class TransformBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        request.body = this.transformRequestBody(request.body)
        return next.handle()
    }

    private transformRequestBody(body: any): any {
        body = JSON.parse(body.data)
        if (body?.Image) {
            delete body?.Image
        }
        return body
    }
}
