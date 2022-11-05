import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ban } from 'src/entities/ban.entity';
import { Review } from 'src/entities/review.entity';
import { RoomTag } from 'src/entities/roomTag.entity';
import { Tag } from 'src/entities/tag.entity';
import { RoomJoinRepository } from '../room/room-join.repository';
import { RoomRepository } from '../room/room.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository, 
      RoomRepository, 
      RoomJoinRepository, 
      Tag, 
      RoomTag, 
      Review, 
      Ban
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
