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
  
  let httpsOptions;
  if(process.env.DEVMODE == 'DEVELOPMENT'){
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, '/../cert/key.pem')),
      cert: fs.readFileSync(path.join(__dirname ,'/../cert/cert.pem'))
    }
  }
  
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, 
    new ExpressAdapter(server)  
  );

  const httpsServer = https.createServer(httpsOptions, server);
  const httpServer = http.createServer(server);
  //cors
  app.enableCors();

  //ejs configuration
  app.useStaticAssets(path.join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'src', 'views'));
  app.setViewEngine("ejs");
  
  //socket.io configuration 
  app.useWebSocketAdapter(new SocketIoAdapter(httpsServer));
  
  await app.init();
  
  const peerServer = ExpressPeerServer(httpServer);

  peerServer.on('connection', (client) => {
    console.log('peer connected');
  })

  app.use('/peerjs', peerServer);

  httpServer.listen(3000);
  httpsServer.listen(3001);
  
  console.log(`server starting on port: ${process.env.PORT}`);
}

bootstrap();