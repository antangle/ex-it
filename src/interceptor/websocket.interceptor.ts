import { Injectable, NestInterceptor, ExecutionContext, CallHandler, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class WebsocketLoggingInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        let data = context.switchToWs().getData();
        this.logger.log(`websocket data: ${data}`);
        return next
            .handle();
    }
}