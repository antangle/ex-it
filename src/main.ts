import { SocketIoAdapter } from './gateway/adapter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ExpressPeerServer } from 'peer';
import * as fs from 'fs';
dotenv.config();
async function bootstrap() {
  const devmode = process.env.DEVMODE;


  //for localhost ssl config, not used in production!!
  let httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', '/static/cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname ,'..', '/static/cert/cert.pem'))
  }
  
  const server = express();
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, 
    new ExpressAdapter(server)  
  );
  
  //cors
  app.enableCors();

  //ejs configuration
  app.useStaticAssets(path.join(__dirname, '..', '/static/public'));
  app.setBaseViewsDir(path.join(__dirname, '..', '/static/views'));
  app.setViewEngine("ejs");
  
  const httpServer = http.createServer(server);

  //for localhost ssl config, not used in production!!
  let webSocketServer;

  if(devmode == 'DEVELOPMENT'){
    webSocketServer = https.createServer(httpsOptions, server);
  }
  else{
    //in production, ALB takes care of ssl then forwards to http.
    webSocketServer = http.createServer(server);
  }

  //socket.io configuration 
  app.useWebSocketAdapter(new SocketIoAdapter(webSocketServer));

  await app.init();

  const peerServer = ExpressPeerServer(httpServer);

  peerServer.on('connection', (client) => {
    console.log('peer connected');
  })

  app.use('/peerjs', peerServer);
  
  httpServer.listen(process.env.PORT);
  webSocketServer.listen(process.env.WEBSOCKET_PORT);

  console.log(devmode);
  console.log(`server starting on port: ${process.env.PORT}, websocket port:${process.env.WEBSOCKET_PORT}`);
}

bootstrap();