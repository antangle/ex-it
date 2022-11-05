import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: Logger){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { method, url, body } = context.getArgByIndex(0);
        
        this.logger.verbose(`request ${method}, ${url}, ${JSON.stringify(body)}`)
        return next
        .handle()
        .pipe(
            tap((res) => this.logger.log(`${JSON.stringify(res)}`)),
        );
    }
}