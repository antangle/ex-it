import { AuthorizedUser } from './../../types/user.d';
import { Controller, Get, Request, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorator/decorators';
import { SetCode, SetJwtAuth, makeApiResponse } from 'src/functions/util.functions';
import { Connection } from 'typeorm';
import { ProfileService } from './profile.service';

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
  async getProfile(@AuthUser() user: AuthorizedUser){
      //testing!
      //const email = 'antangle2@naver.com';
      //const type = 'kakao';
      const email = user.email;
      const info = await this.profileService.getProfileInfo(email);
      return makeApiResponse(HttpStatus.OK, info);
  }

  @SetJwtAuth()
  @SetCode(202)
  @Get('myinfo')
  async getMyPage(@AuthUser() user: AuthorizedUser){
    const reviews = await this.profileService.getMyInfo(user.email);
    return makeApiResponse(HttpStatus.OK, this.profileService.parseReview(reviews));
  }
  
  @SetJwtAuth()
  @SetCode(203)
  @Get('myaccount')
  async getMyAccount(@AuthUser() user: AuthorizedUser){    
    const account = await this.profileService.getMyAccountInfo(user.email, user.type);
    return makeApiResponse(HttpStatus.OK, account);
  }
  
  @SetJwtAuth()
  @SetCode(204)
  @Get('alarm')
  async getAlarm(@AuthUser() user: AuthorizedUser){
    const alarm = await this.profileService.getAlarmInfo(user.email);
    return makeApiResponse(HttpStatus.OK, alarm);
  }

  //date format: YYYY-MM-DD
  //return time: seconds
  @SetJwtAuth()
  @SetCode(205)
  @Get('chattime')
  async getChatTime(
    @AuthUser() user: AuthorizedUser,
    @Query('date') date: Date
    ){
      const chatTime = await this.profileService.getChatTimeInfo(user.email, date);
      return makeApiResponse(HttpStatus.OK, chatTime);
  }
  
}
