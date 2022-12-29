import { consts } from './../../consts/consts';
import { TransactionQueryRunner } from './../../decorator/decorators';
import { TransactionInterceptor } from './../../interceptor/transaction.interceptor';
import { DataLoggingService } from './../../logger/logger.service';
import { RoomRepository } from './../room/room.repository';
import { FcmService } from './../fcm/fcm.service';
import { RedisService } from './../redis/redis.service';
import { CreateAuthDto } from './../auth/dto/create-auth.dto';
import { User } from 'src/entities/user.entity';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UtilService } from '../util/util.service';
import { Controller, Get, Post, Body, Delete, Request, Inject, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetCode } from 'src/functions/util.functions';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(
    private readonly redisService: RedisService,
    private readonly utilService: UtilService,
    private readonly authService: AuthService,
    private readonly connection: Connection,
    private readonly fcmService: FcmService,
    private readonly roomRepository: RoomRepository,
    private readonly loggingService: DataLoggingService,
    ) {}

    @Get('test1')
    async test(@Request() req, @Body('room_id') roomId: number){
      const data = {
        event_name: "test",
        user_id: 0,
        room_id: 0,
        status: consts.HOST
      };
      return 1;
    }

    @Post('set')
    async set(
      @Body('roomname') roomname: string,
      @Body('peer_id') peerId: string,
      ){
      const nickname = "nick"
      const status = "GUEST"
      const data = {
        roomname, peerId, nickname, status
      }
      this.redisService.setRoomPeerCache(data)
      return 1
    }

    @Post('get')
    async get(
      @Body('roomname') roomname: string,
      ){
      return this.redisService.getRoomPeerCache(roomname)
    }

    @Post('lock')
    @SetCode(900)
    async lock(@Request() req, @Body('room_id') roomId: number){
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId
        },
        lock: {
          mode: 'optimistic',
          version: 7
        }
      })
      return room;
    }

  @Post('time')
  @SetCode(900)
  async time(@Request() req, @Body('access_token') accessToken: string){
    return await this.roomRepository.find();
  }

  @Post('fcm')
  @SetCode(900)
  async sendPushMessage(@Body('fcm_token') fcmToken: string){
    const payload = {
      notification: {
        title: '타이틀!!',
        body: '메세지!!!??'
      }
    }
    return await this.fcmService.sendFcmMessage(fcmToken, payload);
  }

  @Get('call')
  @SetCode(900)
  async call(@Request() req, @Body('access_token') accessToken: string){
    return await this.authService.validateOAuthAccessToken(accessToken, 'kakao');
  }
  
  @Post('redis')
  @SetCode(900)
  async redisGet(@Body('key') key: string, @Body('val') val: number){
    const res = await this.redisService.getRoomPeerCache('asd');
    return res;
  }

 /*  @Post('set')
  @SetCode(900)
  async redisSet(@Body('key') key: string, @Body('val') val: number){
    throw new BadRequestCustomException('hi', 10101, {data: 'hi'});
    await this.redisService.set(key, val)
    return makeApiResponse(200, {test: true});
  } */

  @Post('message')
  @SetCode(900)
  async startSms(){
    const temp = await this.utilService.sendSmsMessage('01075704801', 1234);
    return temp;
  }

  @Post('validation')
  @SetCode(900)
  async validator(@Body() loginDto: CreateAuthDto){
    return loginDto;
  }
  
  @Get('')
  @SetCode(901)
  @UseInterceptors(TransactionInterceptor)
  async transaction(
    @TransactionQueryRunner() queryRunner: QueryRunner
  ){
    const temp = await queryRunner.manager.createQueryBuilder()
      .select("*")
      .from(User, 'user')
      .where('user.id = 1')
      .execute()
    const temp2 = await queryRunner.manager.findOne(User, 2);
    return temp;
  }


/*   @Get('cache')
  async getCache(): Promise<string> {
    const savedTime = await this.cacheManager.get<number>('time');
    if(savedTime){
      return `saved time : ${savedTime}`;
    }
    const now = new Date().getTime();
    await this.cacheManager.set<number>('time', now);
    return `save new time : ${now}`;
  }
 */
}
