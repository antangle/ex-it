import { MainService } from './main.service';
import { InjectRepository } from '@nestjs/typeorm';
import { makeApiResponse, SetCode } from 'src/functions/util.functions';
import { Controller, Get, HttpStatus, Response } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TimeSetter } from 'src/entities/timeSetter.entity';

@Controller('main')
export class MainController {
  constructor(
    private readonly mainService: MainService,
    ) {}

  @Get('health')
  healthCheck(): string {
    return 'healthy';
  }

  @Get('service')
  @SetCode(401)
  async serviceCheck(){
    const {start, end} = await this.mainService.getOperationTime();
    return makeApiResponse(HttpStatus.OK, {start, end});
  }
}