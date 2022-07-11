import { makeApiResponse, SetCode } from 'src/functions/util.functions';
import { Controller, Get, Inject, Param, Query, Redirect, Render, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { v4 as uuidv4 } from 'uuid';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiOkResponse, ApiParam, ApiResponse } from '@nestjs/swagger';
import { number, string } from 'joi';

@Controller('main')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly adapterHost: HttpAdapterHost
    ) {}


  @Get('health')
  healthCheck(): string {
    return 'healthy';
  }

  @Get('service')
  @SetCode(900)
  serviceCheck(){
    const start: number = 12;
    const end: number = 16;
    return makeApiResponse(HttpStatus.OK, {start, end});
  }

  @Get('')
  @Render('index.ejs')
  getRoomId(@Query('roomId') roomId: string): any {
    return {
      roomId: roomId,
      devmode: process.env.DEVMODE,
      websocketPort: process.env.WEBSOCKET_PORT,
    }
  }

  @Get('connect')
  @Redirect(`/main?roomId=${uuidv4()}`, 302)
  getHello(): string {
    return ;
  }

}