import { makeApiResponse, SetCode } from 'src/functions/util.functions';
import { Controller, Get, HttpStatus, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpAdapterHost } from '@nestjs/core';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly adapterHost: HttpAdapterHost
    ) {}

  @Get('/main/health')
  healthCheck(): string {
    return 'healthy';
  }

  @Get('favicon.ico')
  favicon(@Response() res): void {
    res.status(204);
    res.end();
  }

  @Get('/main/service')
  @SetCode(900)
  serviceCheck(){
    const start: number = 12;
    const end: number = 16;
    return makeApiResponse(HttpStatus.OK, {start, end});
  }

  /*
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
 */
}