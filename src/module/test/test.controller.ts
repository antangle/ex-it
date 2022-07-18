import { CreateAuthDto } from './../auth/dto/create-auth.dto';
import { User } from 'src/entities/user.entity';
import { Connection } from 'typeorm';
import { UserRepository } from 'src/module/user/user.repository';
import { AuthService } from '../auth/auth.service';
import { UtilService } from '../util/util.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, CACHE_MANAGER, UseFilters, Request } from '@nestjs/common';
import { TestService } from './test.service';
import { Cache } from 'cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { SetCode } from 'src/functions/util.functions';
import { LocalLoginDto } from '../auth/dto/local-login.dto';

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly connection: Connection
  ) {}

  @Get('call')
  @SetCode(900)
  async call(@Request() req, @Body('access_token') accessToken: string){
    return await this.authService.validateOAuthAccessToken(accessToken, 'kakao');
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
      console.log(deleted);
      await queryRunner.commitTransaction();
      return deleted;
    }
    catch(err){
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  @Get('cache')
  async getCache(): Promise<string> {
    const savedTime = await this.cacheManager.get<number>('time');
    if(savedTime){
      return `saved time : ${savedTime}`;
    }
    const now = new Date().getTime();
    await this.cacheManager.set<number>('time', now);
    return `save new time : ${now}`;
  }

}
