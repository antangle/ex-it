import { LeaveDto, LeavedDto } from './dto/leave.dto';
import { PeerJoinDto, PeerConnectedDto } from './dto/peer-join.dto';
import { SocketValidationPipe } from './../validation/websocket.validation';
import { WebsocketLoggingInterceptor } from './../interceptor/websocket.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject, LoggerService, UseInterceptors, HttpStatus } from '@nestjs/common';
import { JoinedDto } from './dto/joined.dto';
import { JoinDto } from './dto/join.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';


//let origin = process.env.DEVMODE == 'dev' ? `https://localhost` : `https://ex-it.app`;
@AsyncApiService({
  serviceName: "socket.io-chat"
})
@UseInterceptors(WebsocketLoggingInterceptor)
@WebSocketGateway({
  transports: ['websocket', 'polling'], 
  allowEIO3: true 
})export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly chatService: ChatService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,

    ) {}
  
  @WebSocketServer() server: Server;

  handleConnection(): void {
    this.logger.log('!connected!', Date.now());
  }

  handleDisconnect(): void {
    this.logger.log('!disonnected!', Date.now());
  }

  //coming from peer.open()
  @AsyncApiSub({
    channel: 'peer-join',
    summary: 'peerId 받기',
    description: '해당 방에 join하고 속한 socket들에게 새로운 peer의 Id를 전송한다. 이후 <peer-connected> 이벤트를 emit 한다',
    message: {
      name: 'data',
      payload: {
        type: PeerJoinDto
      },
    },
  })
  @AsyncApiPub({
    channel: 'peer-connected',
    summary: 'peerId 전송',
    description: '<peer-join> 성공 이후 <peer-connected>라는 이벤트를 발생시키고 peerId와 nickname을 전달한다.',
    message: {
      name: 'data',
      payload: {
        type: PeerConnectedDto
      },
    },
  })
  @SubscribeMessage('peer-join')
  async handleEvent(
      @ConnectedSocket() socket: Socket, 
      @MessageBody(new SocketValidationPipe()) data: PeerJoinDto,
  ) {
    await socket.join(data.roomname);
    const payload: PeerConnectedDto = {
      peerId: data.peerId,
      nickname: data.nickname
    }
    socket.to(data.roomname).emit('peer-connected', payload);
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
      @MessageBody(new SocketValidationPipe()) data: JoinDto
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
        type: MessageDto
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
        type: CreateMessageDto
      },
    },
  })
  @SubscribeMessage('message')
  handleMessage(
      @ConnectedSocket() socket: Socket,
      @MessageBody(new SocketValidationPipe()) data: MessageDto
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
        type: LeaveDto
      },
    },
  })
  @AsyncApiPub({
    channel: 'leaved',
    summary: '해당 방에서 퇴장하면 <leaved> 이벤트가 발생한다.',
    description: 'method is used for test purposes',
    message: {
      name: 'data',
      payload: {
        type: LeavedDto
      },
    },
  })
  @SubscribeMessage('leave')
  async tempLeave(
      @ConnectedSocket() socket: Socket,
      @MessageBody(new SocketValidationPipe()) data: LeaveDto
  ) {
    await socket.leave(data.roomname);
    const payload: LeavedDto = {
      nickname: data.nickname
    }
    socket.to(data.roomname).emit('leaved', payload);
  }

}
