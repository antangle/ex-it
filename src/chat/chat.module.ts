import { MyRedisModule } from './../module/redis/redis.module';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    MyRedisModule
  ],
  providers: [
    ChatGateway, 
    ChatService
  ]
})
export class ChatModule {}
