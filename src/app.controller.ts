import { Controller, Get, Inject, Param, Query, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { v4 as uuidv4 } from 'uuid';
import { HttpAdapterHost } from '@nestjs/core';

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