import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketLoggingInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        let data = context.switchToWs().getData();
        let client: Socket = context.switchToWs().getClient();
        this.logger.log(`socket client id: ${client.id}\n ${JSON.stringify(data)}`);
        return next
            .handle();
    }
}