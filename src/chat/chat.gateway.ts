import { JoinDto } from './dto/join.dto';
import { MessageDto } from './dto/message.dto';
import { testDto } from './dto/test.dto';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';


//let origin = process.env.DEVMODE == 'dev' ? `https://localhost` : `https://ex-it.app`;
@AsyncApiService()
@WebSocketGateway({
  transports: ['websocket', 'polling'], 
  allowEIO3: true 
})export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly chatService: ChatService) {}
  
  @WebSocketServer() server: Server;

  public handleConnection(client: Socket): void {
    console.log('!connected!', Date.now());
  }

  handleDisconnect(@MessageBody() roomId: string): void {
    console.log('!disonnected!');
  }

  //coming from peer.open()
  @SubscribeMessage('join-room')
  async handleEvent(
      @ConnectedSocket() socket: Socket, 
      @MessageBody() data: {
        roomId: string, 
        peerId: string, 
        nickname: string
      },
  ) {
      const {roomId, peerId, nickname} = data;
      console.log(`joined room!\nroomId: ${roomId}\npeerId: ${peerId}`);
      
      await socket.join(roomId);
      socket.to(roomId).emit('user-connected', {peerId, nickname});
  } 
  
  @AsyncApiSub({
    channel: 'join',
    summary: 'join room with key: roomname',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: JoinDto
      },
    },
  })
  @SubscribeMessage('join')
  async tempJoinMessage(
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: {roomname: string}
  ) {
    console.log(data);
    await socket.join(data.roomname);
    socket.emit('joined', `user join in room ${data.roomname}`);
  }

  @AsyncApiPub({
    channel: 'createMessage',
    summary: 'after <message>, send message to all room subscribers',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: MessageDto
      },
    },
  })
  @AsyncApiSub({
    channel: 'message',
    summary: 'recieve message, then send via <createMessage>',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: testDto
      },
    },
  })
  @SubscribeMessage('message')
  handleMessage(
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: testDto
  ): void {
      console.log(data);
      socket.to(data.roomname).emit('createMessage', data.msg, data.nickname);
  }

  @AsyncApiSub({
    channel: 'leave',
    summary: 'leave room',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: JoinDto
      },
    },
  })

  @SubscribeMessage('leave')
  async tempLeave(
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: {roomname: string}
  ) {
    console.log(data);
    await socket.leave(data.roomname);
  }

}
