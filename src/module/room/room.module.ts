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

@Module({
  imports:[
    TypeOrmModule.forFeature([UserRepository, Tag, RoomRepository, RoomTag, RoomJoin]),
    AuthModule,
    UtilModule,
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
