import { DataLoggingService } from './../../logger/logger.service';
import { MyRedisModule } from './../redis/redis.module';
import { Ban } from './../../entities/ban.entity';
import { Review } from './../../entities/review.entity';
import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { RoomRepository } from './room.repository';
import { Tag } from './../../entities/tag.entity';
import { UserRepository } from './../user/user.repository';
import { UserModule } from './../user/user.module';
import { UtilModule } from './../util/util.module';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomJoinRepository } from './room-join.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserRepository, 
      RoomRepository, 
      RoomJoinRepository, 
      Tag, 
      RoomTag, 
      Review, 
      Ban
    ]),
    AuthModule,
    UtilModule,
    UserModule,
    MyRedisModule
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    DataLoggingService
  ]
})
export class RoomModule {}
