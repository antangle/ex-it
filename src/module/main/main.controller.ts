import { InjectRepository } from '@nestjs/typeorm';
import { makeApiResponse, SetCode } from 'src/functions/util.functions';
import { Controller, Get, HttpStatus, Response } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TimeSetter } from 'src/entities/timeSetter.entity';

@Controller('main')
export class MainController {
  constructor(
    @InjectRepository(TimeSetter) private timeSetterRepository: Repository<TimeSetter>
    ) {}

  @Get('health')
  healthCheck(): string {
    return 'healthy';
  }

  @Get('service')
  @SetCode(401)
  async serviceCheck(){
    const temp = await this.timeSetterRepository.findOne();
    const start: number = temp.start;
    const end: number = temp.end;
    return makeApiResponse(HttpStatus.OK, {start, end});
  }
}