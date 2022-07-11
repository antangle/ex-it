import { AuthorizedUser, Tokens } from './../../types/user.d';
import { Controller, Get, Request, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthToken, AuthUser } from 'src/decorator/decorators';
import { SetCode, SetJwtAuth, makeApiResponse, parseReview } from 'src/functions/util.functions';
import { Connection } from 'typeorm';
import { ProfileService } from './profile.service';
import { DateDto } from './dto/date.dto';

@ApiTags('mypage')
@Controller('mypage')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private connection: Connection
    ) {}
    
  @SetJwtAuth()
  @SetCode(201)
  @Get('setting')
  async getProfile(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens
    ){
      //testing!
      //const email = 'antangle2@naver.com';
      //const type = 'kakao';
      const userId = user.id;
      const result = await this.profileService.getProfileInfo(userId);
      return makeApiResponse(HttpStatus.OK, {result, tokens});
    }
    
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
    return makeApiResponse(HttpStatus.OK, {result, tokens});
  }
  
  @SetJwtAuth()
  @SetCode(203)
  @Get('myaccount')
  async getMyAccount(
    @AuthUser() user: AuthorizedUser,
    @AuthToken() tokens: Tokens
  ){    
    const result = await this.profileService.getMyAccountInfo(user.email, user.type);
    return makeApiResponse(HttpStatus.OK, {result, tokens});
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
