import { Server, Socket } from 'socket.io';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

//let origin = process.env.DEVMODE == 'dev' ? `https://localhost` : `https://ex-it.app`;
@WebSocketGateway({
    transports: ['websocket', 'polling'], 
    allowEIO3: true 
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer() server: Server;

    public handleConnection(client: Socket): void {
        console.log('!connected!');
    }

    afterInit(server: any){
        
    }

    @SubscribeMessage('join-room')
    handleEvent(
        @ConnectedSocket() socket: Socket, 
        @MessageBody() data: {roomId: string, userId: string},
    ): void {
        const roomId: string = data.roomId;
        const userId: string = data.userId;
        console.log(`joined room!\nroomId: ${roomId}\nuserId: ${userId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    }

    @SubscribeMessage('message')
    handleMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: {roomId: string, msg: string}
    ): void {
        console.log(data);
        console.log('creating message', data.msg);
        this.server.to(data.roomId).emit('createMessage', data.msg);
    }

    handleDisconnect(@MessageBody() roomId: string): void {
        console.log('disonnected');
    }
}