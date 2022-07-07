import { NumberDto } from './dto/number.dto';
import { SearchRoomDto } from './dto/search-room.dto';
import { UserService } from './../user/user.service';
import { User } from './../../entities/user.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { InsertResult, QueryRunner } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthorizedUser } from './../../types/user.d';
import { Connection } from 'typeorm';
import { Body, Controller, Get, Param, Post, Query, HttpStatus, ParseIntPipe, ParseArrayPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { SetCode, SetJwtAuth, makeApiResponse } from 'src/functions/util.functions';
import { AuthUser } from 'src/decorator/decorators';
import { Room } from 'src/entities/room.entity';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private connection: Connection
    ) {}

  //gets main tag for makeroom
  @SetJwtAuth()
  @SetCode(201)
  @Get('tag')
  async getMakeRoomTags(){
    const mainTags = await this.roomService.getMainTags();
    return makeApiResponse(HttpStatus.OK, mainTags);
  }
  
/*   //gets topics corresponding to main tag
  @SetJwtAuth()
  @SetCode(202)
  @Get('topic')
  async getTopicInfo(
    @Query('id') tagId: number 
  ){
    const topics = await this.roomService.getTopics(tagId);
    return makeApiResponse(HttpStatus.OK, topics);
  } */

  //todo: test
  @SetJwtAuth()
  @SetCode(203)
  @Post('create')
  async createRoom(
    @AuthUser() user: AuthorizedUser,
    @Body() createRoomDto: CreateRoomDto,
  ){
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // get user info
      const userInfo: User = await this.userService.findOneByEmail(user.email, queryRunner);
      createRoomDto.create_user = userInfo;
      createRoomDto.nickname = userInfo.nickname;
      createRoomDto.is_online = true;
      createRoomDto.roomname = randomUUID();

      const { tags, custom_tags, ...roomDto } = createRoomDto;
      const customTags = custom_tags;

      // make roomtags instance with tags
      // save room
      const room = await this.roomService.createRoom(roomDto, queryRunner);
      const roomId = room.raw[0].id;
      const roomname = room.raw[0].roomname;

      // check custom tags
      const parsedCustomTags = this.roomService.parseCustomTags(customTags);
      const customTagId = await this.roomService.checkCustomTags(parsedCustomTags, queryRunner);

      // concat with tags
      customTagId.map(x => {
        tags.push(x.id)
      })

      //remove overlapping tag ids
      const tagSet = new Set(tags);

      // save tag
      const roomTags: RoomTag[] = this.roomService.parseSetToRoomTags(tagSet, roomId);
      const res = await this.roomService.saveRoomTags(roomTags, queryRunner);

      // join host to that room
      const roomJoinDto = this.roomService.makeRoomJoinDto({id: roomId}, userInfo);
      const roomJoin = await this.roomService.joinRoom(roomJoinDto, queryRunner);

      await queryRunner.commitTransaction();
      //todo: join socket!?

      return makeApiResponse(HttpStatus.OK, roomname);
    } catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  
  @SetJwtAuth()
  @SetCode(204)
  @Get('search')
  async searchRoom(
    @AuthUser() user: AuthorizedUser, 
    @Query() query: SearchRoomDto
  ){
    let title = query.title;
    let tagId = query.tag_id;

    if(!title) title = '';
    if(!tagId) tagId = 0;
    const rooms = await this.roomService.getSearchedRooms(tagId, title);
    return makeApiResponse(HttpStatus.OK, rooms);
  }

  //status: host, guest
  @SetJwtAuth()
  @SetCode(205)
  @Get('user_info')
  async getHostInfo(
    @AuthUser() user: AuthorizedUser, 
    @Query('room_id', new ParseIntPipe()) roomId: number,
    @Query('status') status: string
  ){
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();
      if(!status) status = 'host';
      const userId = await this.roomService.getUserId(roomId, status, queryRunner)
      const info = await this.roomService.getUserInfo(userId, queryRunner);

      return makeApiResponse(HttpStatus.OK, info);
    } catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    } finally{
      await queryRunner.release();
    }
  }
}