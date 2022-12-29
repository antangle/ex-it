import { TimeSetter } from './entities/timeSetter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { makeApiResponse, SetCode } from 'src/functions/util.functions';
import { Controller, Get, HttpStatus, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpAdapterHost } from '@nestjs/core';
import { Repository } from 'typeorm';

@Controller('')
export class AppController {
  constructor() {}

  @Get('/favicon.ico')
  favicon(@Response() res): void {
    res.status(204);
    res.end();
  }

}