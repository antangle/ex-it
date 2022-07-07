import { parseReview } from 'src/functions/util.functions';
import { RoomJoinRepository } from './room-join.repository';
import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { RoomRepository } from './room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserRepository } from './../user/user.repository';
import { User } from './../../entities/user.entity';
import { UnhandledException } from './../../exception/unhandled.exception';
import { DatabaseException } from './../../exception/database.exception';
import { Repository, InsertResult } from 'typeorm';
import { Tag } from './../../entities/tag.entity';
import { QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import consts from 'src/consts/consts';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class RoomService {
    constructor(
        private userRepository: UserRepository,
        private roomRepository: RoomRepository,
        private roomJoinRepository: RoomJoinRepository,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(RoomTag) private roomTagRepository: Repository<RoomTag>,
    ){}

    async getMainTags(queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{
            const tags: Tag[] = await tagRepository.find({
                select: ['id', 'name'],
                where: { is_popular: true },
                order: {
                    'id': 'ASC'
                }
            });
            if(!tags) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_MAIN_TAGS_ERROR_CODE);
            return tags;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_MAIN_TAGS_ERROR_CODE, err);
        }
    }

    async checkCustomTags(customTags: Tag[], queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{

            const tags = await tagRepository.createQueryBuilder('tag')
                .insert()
                .values(customTags)
                .orUpdate({
                    conflict_target: ['name'],
                    overwrite: ['name']
                })
                .returning('id')
                .execute();
            return tags.raw;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_MAIN_TAGS_ERROR_CODE, err);
        }
    }

   /*  async getTopics(tagId: number, queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{
            const tags = await tagRepository.createQueryBuilder('tag')
                .select('tag.id, tag.name')
                .where('tag.parentId = :id', {id: tagId})
                .getRawMany();
            
            if(!tags) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_TOPICS_ERROR_CODE);
            return tags;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_TOPICS_ERROR_CODE, err);
        }
    } */

    async createRoom(createRoomDto: Room, queryRunner: QueryRunner): Promise<InsertResult>{
        const roomRepository = queryRunner.manager.getCustomRepository(RoomRepository);
        try{
            const room = await roomRepository.insert(createRoomDto);
            if(!room.identifiers[0].id) throw new DatabaseException(consts.INSERT_FAILED, consts.CREATE_ROOM_ERROR_CODE);
            return room;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.createRoom.name, consts.CREATE_ROOM_ERROR_CODE, err);
        }
    }
    parseSetToRoomTags(tags: Set<number>, roomId: number): RoomTag[]{
        const data = [];
        tags.forEach(x => data.push({
            room: roomId,
            tag: x
        }))
        return data;        
    }
    parseCustomTags(customTags: Array<string>):Tag[]{
        const data = [];
        customTags.map(x => data.push({
            name: x
        }))
        return data;        
    }
    
    makeRoomJoinDto(room: Room, user: User): RoomJoin{
        return {
            room: room,
            user: user,
            status: 'host'
        }; 
    }

    async saveRoomTags(roomtags: RoomTag[], queryRunner: QueryRunner){
        const roomTagRepository = queryRunner ? queryRunner.manager.getRepository(RoomTag) : this.roomTagRepository;
        try{
            return await roomTagRepository.createQueryBuilder('room_tag')
                .insert()
                .into(RoomTag)
                .values(roomtags)
                .execute();
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.SAVE_ROOM_TAGS_ERROR_CODE, err);
        }
    }

    async getAllRooms(page?:number, take?: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const rooms = await roomRepository.getAllRoomsPaged(page, take);
            return rooms;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_ALL_ROOMS_ERROR_CODE, err);
        }
    }
    async getSearchedRooms(tagId: number, searchTitle: string, page?:number, take?: number, queryRunner?: QueryRunner){
        const roomRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomRepository) : this.roomRepository;
        try{
            const rooms = await roomRepository.searchRoomsPaged(tagId, searchTitle, page, take);
            return rooms;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_ALL_ROOMS_ERROR_CODE, err);
        }
    }

    async joinRoom(roomJoinDto, queryRunner?: QueryRunner){
        const roomJoinRepository = queryRunner ? queryRunner.manager.getRepository(RoomJoin) : this.roomJoinRepository;
        try{
            return await roomJoinRepository.insert(roomJoinDto);            
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.JOIN_ROOM_ERROR_CODE, err);
        }
    }

    async getUserId(roomId: number, status: string, queryRunner?: QueryRunner){
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{
            const room = await roomJoinRepository.findOne({
                where: {
                    roomId: roomId,
                    status: status
                }
            });
            console.log(room);
            if(!room) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_USER_ID_ERROR_CODE);
            return 1
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getUserId.name, consts.GET_USER_ID_ERROR_CODE, err);
        }
    }


    //todo
    async getUserInfo(userId: number, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        const roomJoinRepository = queryRunner ? queryRunner.manager.getCustomRepository(RoomJoinRepository) : this.roomJoinRepository;
        try{

            const userInfo = await userRepository.getProfileQuery(userId);
            const tags = await roomJoinRepository.getMostUsedTags(userId);
            const reviews = await userRepository.getReviewCount(userId);
            const parsedReviews = parseReview(reviews);
            return {
                userInfo: userInfo[0],
                usedTags: this.parseTags(tags),
                reviews: parsedReviews
            }
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getUserInfo.name, consts.GET_USER_INFO_ERROR_CODE, err);
        }
    }

    parseTags(tags: any[]){
        const parsed = [];
        tags.map(x => {
            parsed.push(x.tag)
        });
        return parsed;
    }

}