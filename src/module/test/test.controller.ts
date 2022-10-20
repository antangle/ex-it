import { RoomRepository } from './../room/room.repository';
import { FcmService } from './../fcm/fcm.service';
import { BadRequestCustomException } from './../../exception/bad-request.exception';
import { RedisService } from './../redis/redis.service';
import { CreateAuthDto } from './../auth/dto/create-auth.dto';
import { User } from 'src/entities/user.entity';
import { Connection } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UtilService } from '../util/util.service';
import { Controller, Get, Post, Body, Delete, Request, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { makeApiResponse, SetCode } from 'src/functions/util.functions';

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
    ) {}

    @Post('lock')
    @SetCode(900)
    async lock(@Request() req, @Body('room_id') roomId: number){
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId
        },
        lock: {
          mode: 'optimistic',
          version: 0
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
  
  @Delete('')
  @SetCode(901)
  async del(){
    const queryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const deleted = await queryRunner.manager.createQueryBuilder()
        .delete()
        .from(User)
        .where('deleted_at IS NOT NULL')
        .andWhere(`deleted_at < NOW() - INTERVAL '4 day'`)
        .returning('*')
        .execute()
      await queryRunner.commitTransaction();
      return deleted;
    }
    catch(err){
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
