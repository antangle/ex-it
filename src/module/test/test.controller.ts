import { AuthService } from '../auth/auth.service';
import { UtilService } from '../util/util.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, CACHE_MANAGER, UseFilters, Request } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Cache } from 'cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { SetCode } from 'src/functions/util.functions';

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly utilService: UtilService,
    
  ) {}

  @Get('call')
  @SetCode(101)
  async call(@Request() req, @Body('access_token') accessToken: string){
    return await this.authService.validateOAuthAccessToken(accessToken, 'kakao');
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

  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @Get()
  findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.testService.remove(id);
  }
}
