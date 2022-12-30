import { TransactionInterceptor } from './../../interceptor/transaction.interceptor';
import { DataLoggingService } from './../../logger/logger.service';
import { EndRoomException } from './../../exception/occupied.exception';
import { FindPeerDto } from './dto/find-peer.dto';
import { RedisService } from './../redis/redis.service';
import { BadRequestCustomException } from 'src/exception/bad-request.exception';
import { Status } from 'src/consts/enum';
import { JoinRoomDto } from './dto/join.dto';
import { RoomIdDto, makeReviewDto } from './dto/room.dto';
import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomJoinDto } from './dto/room-join-update.dto';
import { RoomEndDto } from './dto/room-end.dto';
import { SearchRoomDto } from './dto/search-room.dto';
import { RoomTag } from './../../entities/roomTag.entity';
import { QueryRunner } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthorizedUser, Tokens } from './../../types/user.d';
import { Connection } from 'typeorm';
import { Body, Controller, Get, Post, HttpStatus, Inject, Logger, Version, UseInterceptors } from '@nestjs/common';
import { RoomService } from './room.service';
import { SetCode, SetJwtAuth, makeApiResponse, ApiResponses, reviewMapperArray } from 'src/functions/util.functions';
import { AuthToken, AuthUser, TransactionQueryRunner } from 'src/decorator/decorators';
import { ApiAcceptedResponse, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { TagResponse } from './response/tag.response';
import { CreateRoomResponse } from './response/create.response';
import { SearchRoomResponse } from './response/search.response';
import { UserInfoResponse } from './response/user-info.response';
import { GetEndRoomResponse } from './response/end.response';
import { consts } from 'src/consts/consts';
import { OccupiedResponse } from './response/occupied.response';
import { FindPeerResponse } from './response/find-peer.response';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OccupiedException } from 'src/exception/occupied.exception';
import { Room } from 'src/entities/room.entity';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly redisService: RedisService,
    private connection: Connection,
    private dataLoggingService: DataLoggingService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger
  ){}

  //gets main tag for makeroom
  @ApiOperation({
    summary: '예시 태그 가져오기',
    description: '로그인 했을 때만 가능. 대화방 만들기에서 필요한 태그들을 배열에 담아 제공한다. 서버에서 태그들의 id로 태그를 식별한다.',
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
    summary: '채팅방 생성',
    description: '필요한 정보들을 받아 host가 채팅방을 생성한다. 태그는 커스텀 태그 포함 총 3개까지 선택 가능하다. 태그는 최소 1개',
  })
  @ApiResponses(CreateRoomResponse)
  @ApiBody({
    type: CreateRoomDto
  })
  @UseInterceptors(TransactionInterceptor)
  @SetJwtAuth()
  @SetCode(203)
  @Post('create')
  async createRoom(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens,
    @Body() createRoomDto: CreateRoomDto,
    @TransactionQueryRunner() queryRunner: QueryRunner
  ){
    const roomname = randomUUID();

    // get user info
    const createUser = {id: user.id}
    createRoomDto.create_user = createUser;
    createRoomDto.is_online = true;
    createRoomDto.roomname = roomname;

    const { tags, custom_tags, ...roomDto } = createRoomDto;
    const customTags = custom_tags;
    const tagsLength = tags.length + custom_tags.length;
    if(tagsLength <= 0 || tagsLength > 3) throw new BadRequestCustomException('태그는 1개이상 3개 이하여야 합니다', null);

    // make roomtags instance with tags
    // save room
    const room = await this.roomService.createRoom(roomDto, queryRunner);
    const roomId = room.id;

    // check custom tags
    const parsedCustomTags = this.roomService.parseCustomTags(customTags);
    const customTagId = await this.roomService.checkCustomTags(parsedCustomTags, queryRunner);

    // concat with tags
    if(customTagId){
      customTagId.map(x => {
        tags.push(x.id)
      })
    }   

    //remove overlapping tag ids
    const tagSet = new Set(tags);

    // save roomtag
    const roomTags: RoomTag[] = this.roomService.parseSetToRoomTags(tagSet, roomId);
    await this.roomService.saveRoomTags(roomTags, queryRunner);

    // join host to that room
    const roomJoinDto = this.roomService.makeRoomJoinDto({id: roomId}, createUser, Status.HOST);
    await this.roomService.joinRoom(roomJoinDto, queryRunner);

    const tagNames = await this.roomService.getTagNames(tagSet, queryRunner);

    this.dataLoggingService.room_create(user, room)
    this.dataLoggingService.tag(user, room, tagNames)

    return makeApiResponse(HttpStatus.OK, {roomname, tokens});
  }

  @ApiOperation({
    summary: '채팅방 탐색',
    description: `
      탐색 option으로 태그id와 방제목(roomname이 아닌 title)을 사용합니다.
      pagenation이 필요하다면 page, take에 값을 주어 가져올 수 있습니다. page는 페이지, take는 한번에 가져오는 갯수를 뜻합니다.
      값을 주지 않는다면 디폴트로 take=${consts.PAGINATION_TAKE}, page=1 입니다.
      `,
  })
  @ApiResponses(SearchRoomResponse)
  @SetJwtAuth()
  @SetCode(204)
  @Post('search')
  async searchRoom(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens,
    @Body() searchRoomDto: SearchRoomDto
  ){
    const rooms = await this.roomService.getSearchedRooms(user.id, searchRoomDto);
    return makeApiResponse(HttpStatus.OK, {rooms, tokens});
  }

  @ApiOperation({
    summary: '유저 정보',
    description: `
      해당 방에 접속한 host나 speaker의 정보를 가져온다.
    `,
  })
  @ApiResponses(UserInfoResponse)
  @UseInterceptors(TransactionInterceptor)
  @SetJwtAuth()
  @SetCode(205)
  @Post('user_info')
  async getHostInfo(
    @Body() userInfoDto: UserInfoDto,
    @AuthToken() tokens: Tokens,
    @TransactionQueryRunner() queryRunner: QueryRunner
  ){
    const roomId = userInfoDto.room_id;
    const hostAndSpeaker = await this.roomService.getHostAndSpeaker(roomId);

    const hostUserId = hostAndSpeaker[0].id;
    const speakerUserId = hostAndSpeaker[0].is_occupied ? hostAndSpeaker[1].id : null;

    this.logger.verbose(`host and speaker: ${JSON.stringify(hostAndSpeaker)}`)
    this.logger.verbose(hostUserId)

    const host = await this.roomService.getUserInfo(hostUserId, queryRunner);
    const speaker = speakerUserId ? await this.roomService.getUserInfo(speakerUserId, queryRunner) : null;

    return makeApiResponse(HttpStatus.OK, {host, speaker, tokens});
  }

  @ApiOperation({
    summary: 'conversation_end 시 필요한 정보 가져오기',
    description: `대화시간, 옵저버 카운트, 리뷰 내역을 제공한다. (대화시간 프론트에서 자체적으로?)`,
  })
  @ApiResponses(GetEndRoomResponse)
  @SetJwtAuth()
  @SetCode(206)
  @Post('conversation_end')
  async getReviewInfo(
    @AuthToken() tokens: Tokens,
    @Body('room_id') roomId: number
  ){
    const roomData = await this.roomService.findRoom(roomId);
    const reviews = await this.roomService.findReview();
    return makeApiResponse(HttpStatus.OK, {...roomData, reviews, tokens});
  }

  @ApiOperation({
    summary: '방 종료',
    description: `
      host는 방을 continue 시킬지 말지 결정할 수 있다. host에서 결정할 시 해당 room의 값들을 수정한다.
      speaker나 guest라면 자신의 대화 시간만 업데이트하고 끝낸다.
    `,
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @ApiBody({
    type: RoomEndDto
  })
  @UseInterceptors(TransactionInterceptor)
  @SetJwtAuth()
  @SetCode(207)
  @Post('end')
  async endRoom(
    @Body() roomEndDto: RoomEndDto,
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ){
    const userId = user.id;
    const roomId = roomEndDto.room_id;

    const {roomname, peerId, nickname, status} = roomEndDto;
    //해당 peerId 리스트에서 제거
    await this.redisService.removeRoomPeerCache({roomname, peerId, nickname, status})
    const updateRoomDto: UpdateRoomDto = {
      is_occupied: null,
      is_online: roomEndDto.continue,
      speakerId: null
    }

    if(roomEndDto.status == Status.HOST){
      delete updateRoomDto.is_occupied;
      if(!roomEndDto.continue){
        await this.redisService.removeRoomKey(roomEndDto.roomname)
        await this.roomService.updateRoomOnline(roomId, updateRoomDto, queryRunner);
      }
    }
    else if(roomEndDto.status == Status.SPEAKER){
      if(roomEndDto.continue){
        delete updateRoomDto.is_online;
      }
      await this.roomService.updateRoomOnline(roomId, updateRoomDto, queryRunner);
    }
/*       if(roomEndDto.status != Status.GUEST){
    }
*/
    /* let fellowStatus = roomEndDto.status == Status.HOST? Status.SPEAKER : Status.HOST;
    const fellowId = await this.roomService.getUserIdFromStatus(roomId, fellowStatus, queryRunner);

    //host speaker 둘다 있고, GUEST가 아니며, 통화를 한 상태 -> 리뷰 생성
    // 리뷰가 생성되면 해당 방은 search에서 보이지 않음.
    if(fellowId && roomEndDto.call_time > 0 && roomEndDto.status != Status.GUEST){
      //get fellow id from roomJoin
      const review = this.roomService.makeReview(roomEndDto, fellowId);
      await this.roomService.createReview(review, queryRunner);
    } */

    //update room_join tables
/*     const updateRoomJoinDto: UpdateRoomJoinDto = {
      total_time: roomEndDto.total_time,
      call_time: roomEndDto.call_time,
      out: false
    }

    await this.roomService.updateRoomJoin(userId, roomId, roomEndDto.status, updateRoomJoinDto, queryRunner);
 */
    this.dataLoggingService.room_end(user, roomId, status);

    return makeApiResponse(HttpStatus.OK, {tokens});
  }

  @ApiOperation({
    summary: 'make review',
    description: '통화가 끝난 이후 방이 꺼질 때 리뷰 생성',
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @ApiBody({
    type: makeReviewDto
  })
  @UseInterceptors(TransactionInterceptor)
  @SetJwtAuth()
  @SetCode(213)
  @Post('review')
  async makeReview(
    @Body() makeReviewDto: makeReviewDto,
    @AuthToken() tokens: Tokens,
    @AuthUser() user: AuthorizedUser,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ){
    const roomId = makeReviewDto.room_id;
    let fellowStatus = makeReviewDto.status == Status.HOST? Status.SPEAKER : Status.HOST;
    const fellowId = await this.roomService.getUserIdFromStatus(roomId, fellowStatus, queryRunner);

    console.log(makeReviewDto)
    console.log(`user: ${user.id}, fellow: ${fellowId}`)

    const updateRoomJoinDto: UpdateRoomJoinDto = {
      total_time: makeReviewDto.total_time,
      call_time: makeReviewDto.call_time,
      out: false
    }

    //host speaker 둘다 있고, GUEST가 아니며, 통화를 한 상태 -> 리뷰 생성
    // * 리뷰가 생성되면 해당 방은 search에서 보이지 않음.
    if(makeReviewDto.status != Status.GUEST){
      //get fellow id from roomJoin
      const review = this.roomService.makeReview(makeReviewDto, fellowId);
      await this.roomService.createReview(review, queryRunner);  
      await this.roomService.updateRoomJoin(user.id, roomId, makeReviewDto.status, updateRoomJoinDto, queryRunner);
      this.dataLoggingService.review(user, makeReviewDto.call_time);
    }

    return makeApiResponse(HttpStatus.OK, {tokens});
  }

  @ApiOperation({
    summary: 'ban user',
    description: '해당 room의 host를 ban함. ban된 user들의 방은 탐색 시 보이지 않는다.',
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
    await this.roomService.banUser(mainUser, banUser);
    return makeApiResponse(HttpStatus.OK, {tokens});
  }

  @ApiOperation({
    summary: '해당 room에 speaker가 있는지 체크',
    description: '해당 room의 speaker자리가 비어있는지 체크. 차있으면 true, 비어있으면 false',
  })
  @ApiResponses(OccupiedResponse)
  //true if speaker is talking, else false
  @SetJwtAuth()
  @SetCode(209)
  @Post('check_occupied')
  async checkIfOccupied(
    @Body() roomIdDto: RoomIdDto,
    @AuthToken() tokens: Tokens,
  ){
    const roomId = roomIdDto.room_id;
    const isOccupied = await this.roomService.checkOccupied(roomId);
    return makeApiResponse(HttpStatus.OK, {isOccupied, tokens});
  }

  @ApiOperation({
    summary: '채팅방 입장',
    description: `
      성공시 response code 200, 202이 존재한다.\n
      200: guest로 입장하였거나, speaker가 없어 채팅방 입장을 speaker로 성공한 상태.\n
      202: 이미 다른 speaker가 join한 상태
    `,
  })
  @ApiAcceptedResponse({
    type: BaseOKResponseWithTokens
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @ApiBody({
    type: JoinRoomDto
  })
  @UseInterceptors(TransactionInterceptor)
  @SetJwtAuth()
  @SetCode(210)
  @Post('join')
  async joinRoom(
    @AuthToken() tokens: Tokens,
    @AuthUser() user: AuthorizedUser,
    @Body() joinRoomDto: JoinRoomDto,
    @TransactionQueryRunner() queryRunner: QueryRunner,
  ){
    const roomId = joinRoomDto.room_id;
    const status = joinRoomDto.status;    
    const room = await this.roomService.findRoomById(roomId, queryRunner);
    if(!room.is_online) throw new EndRoomException(consts.END_ROOM_ERROR_MSG, consts.END_ROOM_ERROR_CODE)

    if(status == Status.SPEAKER){
      const isOccupied = (room.is_occupied )? true : false || !room.is_online;
      //if other speaker already joined in room.
      if(isOccupied) throw new OccupiedException(consts.ALREADY_OCCUPIED, consts.ALREADY_OCCUPIED_ERROR_CODE);
      /* await this.redisService.setRoomSpeakerCache(roomId, user.id);  */
    }


    const roomJoinDto = this.roomService.makeRoomJoinDto({id: roomId}, {id: user.id}, status);
    await this.roomService.joinRoom(roomJoinDto, queryRunner);

    if(status == Status.SPEAKER){
      const updateRoomDto: UpdateRoomDto = {
        is_occupied: new Date(),
        speakerId: user.id
      };
      await this.roomService.updateRoomOccupiedLock(roomId, joinRoomDto.version, updateRoomDto, queryRunner);

/*         const cachedUserId = await this.redisService.getRoomSpeakerCache(roomId);
      if(cachedUserId){
        if(cachedUserId != user.id) throw new OccupiedException(consts.ALREADY_OCCUPIED, consts.ALREADY_OCCUPIED_ERROR_CODE);
      } */
    }
    this.dataLoggingService.room_join(user, room, status);
    return makeApiResponse(HttpStatus.OK, {tokens});      
  }

  @ApiOperation({
    summary: 'peer 확인',
    description: '해당 방의 peerId 리스트 확인.',
  })
  @ApiResponses(FindPeerResponse)
  @SetJwtAuth()
  @SetCode(211)
  @Post('peer')
  async findPeers(
    @Body() findPeerDto: FindPeerDto,
    @AuthToken() tokens: Tokens,
  ){
    const peers = await this.redisService.getRoomPeerCache(findPeerDto.roomname);
    return makeApiResponse(HttpStatus.OK, {tokens, peers});
  }

  @ApiOperation({
    summary: 'peer 제거',
    description: '해당 roomname의 모든 정보를 cache에서 제거',
  })
  @ApiResponses(BaseOKResponseWithTokens)
  @SetJwtAuth()
  @SetCode(212)
  @Post('remove_room_peers')
  async removePeer(
    @Body() findPeerDto: FindPeerDto,
    @AuthToken() tokens: Tokens,
  ){
    await this.redisService.removeRoomKey(findPeerDto.roomname);
    const peers = await this.redisService.getRoomPeerCache(findPeerDto.roomname);
    console.log(`after exit: ${findPeerDto.roomname}\n ${peers}`)
    return makeApiResponse(HttpStatus.OK, {tokens});
  }
}