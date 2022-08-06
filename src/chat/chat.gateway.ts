import { JoinedDto } from './dto/joined.dto';
import { JoinDto } from './dto/join.dto';
import { MessageDto } from './dto/message.dto';
import { testDto } from './dto/test.dto';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
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
        roomname: string, 
        peerId: string, 
        nickname: string
      },
  ) {
      const {roomname, peerId, nickname} = data;
      console.log(`joined room!\nroomId: ${roomname}\npeerId: ${peerId}`);
      
      await socket.join(roomname);
      socket.to(roomname).emit('user-connected', {peerId, nickname});
  } 
  
  @AsyncApiSub({
    channel: 'join',
    summary: 'roomname에 해당하는 방에 접속한다.',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: JoinDto
      },
    },
  })
  @AsyncApiPub({
    channel: 'joined',
    summary: '<join> 성공 이후 <joined>라는 이벤트를 발생시키고 성공 메세지를 전달한다.',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: JoinedDto
      },
    },
  })
  @SubscribeMessage('join')
  async tempJoinMessage(
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: {roomname: string}
  ) {
    const payload = {
      msg: `user joined in room ${data.roomname}`
    };

    await socket.join(data.roomname);
    socket.emit('joined', payload);
  }

  @AsyncApiSub({
    channel: 'message',
    summary: '<message>이벤트를 받아 해당 roomname의 방에 접속한 모든 소켓에게 <createMessage>이벤트를 발생시킨다.',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: testDto
      },
    },
  })
  @AsyncApiPub({
    channel: 'createMessage',
    summary: '채팅 내역과 보낸이의 nickname을 담아 해당 roomname의 방에 접속한 모두에게 <createMessage>이벤트를 전송한다.',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: MessageDto
      },
    },
  })
  @SubscribeMessage('message')
  handleMessage(
      @ConnectedSocket() socket: Socket,
      @MessageBody() data: testDto
  ): void {
      const payload = {
        msg: data.msg,
        nickname: data.nickname
      }
      socket.to(data.roomname).emit('createMessage', payload);
  }

  @AsyncApiSub({
    channel: 'leave',
    summary: '해당 방에서 퇴장한다.',
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
    await socket.leave(data.roomname);
  }

}
