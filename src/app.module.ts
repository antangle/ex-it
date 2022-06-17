import { AppGateway } from './gateway/socket.gateway';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyTypeormModule } from './config/typeorm.module';

@Module({ 
  imports: [
    MyTypeormModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway
  ],
}) 
export class AppModule {}