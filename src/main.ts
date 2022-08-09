import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { asyncApiOptions } from './config/asyncapi.config';
import { GlobalExceptionFilter } from './filter/global.filter';
import { SocketIoAdapter } from './config/socketio.adapter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import * as path from 'path';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/swagger.config';
import { getServer } from './config/https.config';
import { AsyncApiModule } from 'nestjs-asyncapi';

async function bootstrap() {
  const devmode = process.env.DEVMODE;
  //for localhost ssl config, not used in production!!
  
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, 
    new ExpressAdapter(server)  
  );
  
  //cors
  app.enableCors();

  //pipe
  /*
    whitelist: ignore values that are not in entity decorator.
    transform: auto-transform types caught by controller param
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )

  //ejs configuration
  app.useStaticAssets(path.join(__dirname, '..', '/static'));
  app.setBaseViewsDir(path.join(__dirname, '..', '/views'))
  app.setViewEngine("ejs");
  
  //swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('apidocs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1
    }
  });

  //logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  //filter
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  //asyncapi
  const asyncapiDocument = await AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('/async-api', app, asyncapiDocument);
  

  //for localhost ssl config!!
  const webSocketServer = getServer(devmode, server);

  //socket.io configuration 
  app.useWebSocketAdapter(new SocketIoAdapter(webSocketServer));  

  await app.init();

  //listen to ports
  app.listen(process.env.PORT);
  webSocketServer.listen(process.env.WEBSOCKET_PORT);

  console.log(devmode);
  console.log(`server starting on port: ${process.env.PORT}, websocket port:${process.env.WEBSOCKET_PORT}`);
}

bootstrap();