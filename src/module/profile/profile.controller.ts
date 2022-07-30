import { AuthorizedUser, Tokens } from './../../types/user.d';
import { Controller, Get, Request, HttpStatus, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthToken, AuthUser } from 'src/decorator/decorators';
import { SetCode, SetJwtAuth, makeApiResponse, parseReview, ApiResponses } from 'src/functions/util.functions';
import { Connection } from 'typeorm';
import { ProfileService } from './profile.service';
import { SettingResponse } from './response/profile.response';
import { MyInfoResponse } from './response/myinfo.response';
import { MyAccountResponse } from './response/myaccount.response';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private connection: Connection
    ) {}
  

  @ApiOperation({
    summary: '유저 프로필 info',
    description: 'mypage/setting에 필요한 정보들 모음',
  })
  @ApiResponses(SettingResponse)
  @SetJwtAuth()
  @SetCode(201)
  @Get('setting')
  async getProfile(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens
    ){
      const userId = user.id;
      const result = await this.profileService.getProfileInfo(userId);
      return makeApiResponse(HttpStatus.OK, {...result, tokens});
    }
  
  @ApiOperation({
    summary: 'myinfo 스탯',
    description: 'myinfo_stat_디자인2 에 필요한 정보',
  })
  @ApiResponses(MyInfoResponse)
  @SetJwtAuth()
  @SetCode(202)
  @Get('myinfo')
  async getMyPage(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens
  ){
    const userId = user.id;
    const reviews = await this.profileService.getMyInfo(userId);
    const reviewData = parseReview(reviews);
    
    const result = {
      nickname: reviews[0].nickname,
      reviews: reviewData
    }
    return makeApiResponse(HttpStatus.OK, {...result, tokens});
  }
  
  @ApiOperation({
    summary: 'mypage - 내계정',
    description: 'mypage - 내계정에 필요한 정보',
  })
  @ApiResponses(MyAccountResponse)
  @SetJwtAuth()
  @SetCode(203)
  @Get('myaccount')
  async getMyAccount(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens
  ){    
    const result = await this.profileService.getMyAccountInfo(user.email, user.type);
    return makeApiResponse(HttpStatus.OK, {...result, tokens});
  }
/*
  @SetJwtAuth()
  @SetCode(204)
  @Get('alarm')
  async getAlarm(@AuthUser() user: AuthorizedUser){
    const alarm = await this.profileService.getAlarmInfo(user.email);
    return makeApiResponse(HttpStatus.OK, alarm);
  } */

  //date format: YYYY-MM-DD
  //return time: seconds
/*   @SetJwtAuth()
  @SetCode(205)
  @Get('chattime')
  async getChatTime(
    @AuthUser() user: AuthorizedUser,
    @Query() dateDto: DateDto
    ){
      let date = dateDto.date;
      if(!date) date = new Date(0);
      
      const chatTime = await this.profileService.getChatTimeInfo(user.email, date);
      return makeApiResponse(HttpStatus.OK, chatTime);
  }
   */
}
