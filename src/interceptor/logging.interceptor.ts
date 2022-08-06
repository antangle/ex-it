import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: Logger){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('interceptor...');
        const { method, url, body } = context.getArgByIndex(0);
        
        this.logger.log(`request ${method}, ${url}, ${JSON.stringify(body)}`)
        return next
        .handle()
        .pipe(
            tap((res) => this.logger.log(`${JSON.stringify(res)}`)),
        );
    }
}