import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
    constructor(){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { method, url, body } = context.getArgByIndex(0);
        
        const now = Date.now()
        return next
            .handle()
            .pipe(
                tap(() => console.log(Date.now() - now)),
            );
    }
}