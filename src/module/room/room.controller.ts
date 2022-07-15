import { RoomIdDto } from './dto/number.dto';
import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomJoinDto } from './dto/room-join-update.dto';
import { RoomEndDto } from './dto/room-end.dto';
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
import { SetCode, SetJwtAuth, makeApiResponse, ApiResponses } from 'src/functions/util.functions';
import { AuthToken, AuthUser } from 'src/decorator/decorators';
import { Room } from 'src/entities/room.entity';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { TagResponse } from './response/tag.response';
import { CreateRoomResponse } from './response/create.response';
import { SearchRoomResponse } from './response/search.response';
import { UserInfoResponse } from './response/user-info.response';
import { GetEndRoomResponse } from './response/end.response';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private connection: Connection
  ) {}


  
  //gets main tag for makeroom
  @ApiOperation({
    summary: 'get main tags for room - create',
    description: 'only available when logged in!',
  })
  @ApiResponses(TagResponse)
  @SetJwtAuth()
  @SetCode(201)
  @Get('tag')
  async getMakeRoomTags(@AuthToken() tokens: Tokens){
    const tags = await this.roomService.getMainTags();
    return makeApiResponse(HttpStatus.OK, {tags, tokens});
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

  @ApiOperation({
    summary: 'create room',
    description: 'right after response, call event - join with nickname, roomname to connect socket',
  })
  @ApiResponses(CreateRoomResponse)
  @ApiBody({
    type: CreateRoomDto
  })
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
      const roomname =  randomUUID();
      
      // get user info
      const userInfo: User = await this.userService.findUserById(user.id, queryRunner);
      createRoomDto.create_user = userInfo;
      createRoomDto.nickname = userInfo.nickname;
      createRoomDto.is_online = true;
      createRoomDto.roomname = roomname;

      
      const { tags, custom_tags, ...roomDto } = createRoomDto;
      const customTags = custom_tags;
      
      // make roomtags instance with tags
      // save room
      const room = await this.roomService.createRoom(roomDto, queryRunner);
      const roomId = room.raw[0].id;

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
      await this.roomService.saveRoomTags(roomTags, queryRunner);

      // join host to that room
      const roomJoinDto = this.roomService.makeRoomJoinDto({id: roomId}, userInfo);
      await this.roomService.joinRoom(roomJoinDto, queryRunner);

      await queryRunner.commitTransaction();

      return makeApiResponse(HttpStatus.OK, {roomname, nickname: userInfo.nickname, tokens});
    } catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @ApiOperation({
    summary: 'search room',
    description: `
      you can give search options: tag_id, title. if not needed, simply do not pass argument
      you can also pass pagination options via page, take. default value is page=30, take=0
      `,
  })
  @ApiResponses(SearchRoomResponse)
  @SetJwtAuth()
  @SetCode(204)
  @Get('search')
  async searchRoom(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens,
    @Query() searchRoomDto: SearchRoomDto
  ){
    const {tag_id, title, take, page} = searchRoomDto;
    const rooms = await this.roomService.getSearchedRooms(user.id, tag_id, title, page, take);
    return makeApiResponse(HttpStatus.OK, {rooms, tokens});
  }

  @ApiOperation({
    summary: 'get user information of host or guest.',
    description: `
      specify status: host or guest. if not specified, host is set to default
    `,
  })
  @ApiResponses(UserInfoResponse)
  //status: host, guest
  @SetJwtAuth()
  @SetCode(205)
  @Get('user_info')
  async getHostInfo(
    @Query() userInfoDto: UserInfoDto,
    @AuthToken() tokens: Tokens,
  ){
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    const roomId = userInfoDto.room_id;
    const status = userInfoDto.status;
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const targetUserId = await this.roomService.getUserIdFromStatus(roomId, status, queryRunner);
      const result = await this.roomService.getUserInfo(targetUserId, queryRunner);

      await queryRunner.commitTransaction();

      return makeApiResponse(HttpStatus.OK, {...result, tokens});
    } catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    } finally{
      await queryRunner.release();
    }
  }

  @ApiOperation({
    summary: 'get information for room-end page',
    description: `nothing special`,
  })
  @ApiResponses(GetEndRoomResponse)
  @SetJwtAuth()
  @SetCode(206)
  @Get('end')
  async getReviewInfo(
    @AuthToken() tokens: Tokens,
    @Query('room_id', new ParseIntPipe()) roomId: number
  ){
    const result = await this.roomService.findRoom(roomId);
    const reviews = this.roomService.findReview();
    return makeApiResponse(HttpStatus.OK, {...result, reviews, tokens});
  }


  @ApiOperation({
    summary: 'end room',
    description: 'continue: true - 대화방유지 false - 메인으로 이동',
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @ApiBody({
    type: RoomEndDto
  })
  @SetJwtAuth()
  @SetCode(207)
  @Post('end')
  async endRoom(
    @Body() roomEndDto: RoomEndDto,
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens,
  ){
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();

      //update room_join tables
      const userId = user.id;
      const roomId = roomEndDto.room_id;
      const updateRoomJoinDto: UpdateRoomJoinDto = {
        total_time: roomEndDto.total_time,
        call_time: roomEndDto.call_time
      }
      
      const updateRoomDto: UpdateRoomDto = {
        is_online: false
      }
      if(!roomEndDto.continue) await this.roomService.updateRoomOnline(roomId, updateRoomDto);

      await this.roomService.updateRoomJoin(userId, roomId, updateRoomJoinDto, queryRunner);

      if(roomEndDto.review_mode < 5){
        //get fellow id from roomJoin
        let status = roomEndDto.status == 'guest' ? 'host' : 'guest';
        const fellowId = await this.roomService.getUserIdFromStatus(roomId, status);
        
        const review = this.roomService.makeReview(roomEndDto, fellowId);
        await this.roomService.createReview(review, queryRunner);
      }

      await queryRunner.commitTransaction();
      
      return makeApiResponse(HttpStatus.OK, {tokens});
    } catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @ApiOperation({
    summary: 'ban user',
    description: '해당 room의 host를 ban함',
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @ApiBody({
    type: RoomIdDto
  })
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
    return makeApiResponse(HttpStatus.OK, {tokens});
  }

  @ApiOperation({
    summary: 'check if room is occupied',
    description: '해당 room의 guest자리가 비어있는지 체크. 차있으면 true, 비어있으면 false',
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @ApiBody({
    type: RoomIdDto
  })
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