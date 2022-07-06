import { SearchRoomDto } from './dto/search-room.dto';
import { UserService } from './../user/user.service';
import { User } from './../../entities/user.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { InsertResult, QueryRunner } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthorizedUser } from './../../types/user.d';
import { Connection } from 'typeorm';
import { Body, Controller, Get, Param, Post, Query, HttpStatus } from '@nestjs/common';
import { RoomService } from './room.service';
import { SetCode, SetJwtAuth, makeApiResponse } from 'src/functions/util.functions';
import { AuthUser } from 'src/decorator/decorators';
import { Room } from 'src/entities/room.entity';
import { ApiTags } from '@nestjs/swagger';

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
  
  //gets topics corresponding to main tag
  @SetJwtAuth()
  @SetCode(202)
  @Get('topic')
  async getTopicInfo(
    @Query('id') tagId: number 
  ){
    const topics = await this.roomService.getTopics(tagId);
    return makeApiResponse(HttpStatus.OK, topics);
  }

  @SetJwtAuth()
  @SetCode(203)
  @Post('create')
  async createRoom(
    @AuthUser() user: AuthorizedUser,
    @Body() createRoomDto: CreateRoomDto,
    @Body('tags') tags: Array<number>
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
      // make roomtags instance with tags
      // save room
      const roomId = await this.roomService.createRoom(createRoomDto, queryRunner);

      // save tag
      const roomTags: RoomTag[] = await this.roomService.parseArrayToRoomTags(tags, roomId);
      const res = await this.roomService.saveRoomTags(roomTags, queryRunner);

      // join host to that room
      const roomJoinDto = this.roomService.makeRoomJoinDto(roomId, userInfo);
      const roomJoin = await this.roomService.joinRoom(roomJoinDto, queryRunner);

      await queryRunner.commitTransaction()


      //todo: join socket!?

      return makeApiResponse(HttpStatus.OK);
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

}
