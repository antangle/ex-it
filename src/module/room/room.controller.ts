import { ReviewDto } from './dto/review.dto';
import { NumberDto } from './dto/number.dto';
import { SearchRoomDto } from './dto/search-room.dto';
import { UserService } from './../user/user.service';
import { User } from './../../entities/user.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { InsertResult, QueryRunner } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthorizedUser, Tokens } from './../../types/user.d';
import { Connection } from 'typeorm';
import { Body, Controller, Get, Param, Post, Query, HttpStatus, ParseIntPipe, ParseArrayPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { SetCode, SetJwtAuth, makeApiResponse } from 'src/functions/util.functions';
import { AuthToken, AuthUser } from 'src/decorator/decorators';
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
  async getMakeRoomTags(@AuthToken() tokens: Tokens){
    const result = await this.roomService.getMainTags();
    return makeApiResponse(HttpStatus.OK, {result, tokens});
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
    @AuthToken() tokens: Tokens,
    @Body() createRoomDto: CreateRoomDto,
  ){
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // get user info
      const userInfo: User = await this.userService.findUserById(user.id, queryRunner);
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

      return makeApiResponse(HttpStatus.OK, {roomname, tokens});
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
    @AuthToken() tokens: Tokens,
    @Query() query: SearchRoomDto
  ){
    let title = query.title;
    let tagId = query.tag_id;

    if(!title) title = '';
    if(!tagId) tagId = 0;
    const result = await this.roomService.getSearchedRooms(user.id, tagId, title);
    return makeApiResponse(HttpStatus.OK, {result, tokens});
  }

  //status: host, guest
  @SetJwtAuth()
  @SetCode(205)
  @Get('user_info')
  async getHostInfo(
    @Query('room_id', new ParseIntPipe()) roomId: number,
    @AuthToken() tokens: Tokens,
    @Query('status') status: string
  ){
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();
      if(!status) status = 'host';
      const targetUserId = await this.roomService.getUserIdByStatus(roomId, status, queryRunner)
      const result = await this.roomService.getUserInfo(targetUserId, queryRunner);

      return makeApiResponse(HttpStatus.OK, {result, tokens});
    } catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    } finally{
      await queryRunner.release();
    }
  }

  @SetJwtAuth()
  @SetCode(206)
  @Get('end')
  async getReviewInfo(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens,
    @Body('room_id') roomId: number
  ){
    const result = await this.roomService.findRoom(roomId);
    const reviews = this.roomService.findReview();
    return makeApiResponse(HttpStatus.OK, {...result, reviews, tokens});
  }

  @SetJwtAuth()
  @SetCode(207)
  @Post('end')
  async createReview(
    @Body() reviewDto: ReviewDto,
    @AuthToken() tokens: Tokens,
  ){
    if(reviewDto.review_id < 5){
      const review = this.roomService.makeReview(reviewDto);
      await this.roomService.createReview(review);
    }
    
    return makeApiResponse(HttpStatus.OK, tokens);
  }

  @SetJwtAuth()
  @SetCode(208)
  @Post('ban')
  async banUser(
    @AuthUser() user: AuthorizedUser,
    @Body('room_id') roomId: number,
    @AuthToken() tokens: Tokens,
  ){
    //roomId로 유저 찾아서 그 유저 밴.
    const banUser = await this.roomService.findRoomUser(roomId);
    const mainUser = {
      id: user.id
    }
    const result = await this.roomService.banUser(mainUser, banUser);
    return makeApiResponse(HttpStatus.OK, tokens);
  }

  //true if guest is talking, else false  
  @SetJwtAuth()
  @SetCode(208)
  @Get('check')
  async checkIfOccupied(
    @Body('room_id') roomId: number,
    @AuthToken() tokens: Tokens,
  ){
    const isOccupied = await this.roomService.checkOccupied(roomId);
    return makeApiResponse(HttpStatus.OK, {isOccupied, tokens});
  }
}