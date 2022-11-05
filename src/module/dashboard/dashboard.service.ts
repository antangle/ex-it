import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Ban } from 'src/entities/ban.entity';
import { Review } from 'src/entities/review.entity';
import { RoomTag } from 'src/entities/roomTag.entity';
import { Tag } from 'src/entities/tag.entity';
import { Repository } from 'typeorm';
import { RoomJoinRepository } from '../room/room-join.repository';
import { RoomRepository } from '../room/room.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class DashboardService {
    constructor(
        private userRepository: UserRepository,
        private roomRepository: RoomRepository,
        private roomJoinRepository: RoomJoinRepository,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(RoomTag) private roomTagRepository: Repository<RoomTag>,
        @InjectRepository(Ban) private banRepository: Repository<Ban>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger
    ){}

    async getUserInfo(){
        await this.userRepository.createQueryBuilder()
            .select()
            .getMany()
    }
}