import { RoomJoin } from './../../entities/roomJoin.entity';
import { RoomTag } from './../../entities/roomTag.entity';
import { RoomRepository } from './room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserRepository } from './../user/user.repository';
import { User } from './../../entities/user.entity';
import { UnhandledException } from './../../exception/unhandled.exception';
import { DatabaseException } from './../../exception/database.exception';
import { Repository } from 'typeorm';
import { Tag } from './../../entities/tag.entity';
import { QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import consts from 'src/consts/consts';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class RoomService {
    constructor(
        private roomRepository: RoomRepository,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(RoomTag) private roomTagRepository: Repository<RoomTag>,
        @InjectRepository(RoomJoin) private roomJoinRepository: Repository<RoomJoin>,
    ){}

    async getMainTags(queryRunner ?: QueryRunner){
        const tagRepository = queryRunner ? queryRunner.manager.getRepository(Tag) : this.tagRepository;
        try{
            const tags: Tag[] = await tagRepository.find({
                select: ['id', 'name'],
                where: {is_popular: true},
                order: {
                    name: 'ASC'
                }
            });
            if(!tags) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_MAIN_TAGS_ERROR_CODE);
            return tags;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMainTags.name, consts.GET_MAIN_TAGS_ERROR_CODE, err);
        }
    }

    async getTopics(tagId: number, queryRunner ?: QueryRunner){
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
    }

    async createRoom(createRoomDto: CreateRoomDto, queryRunner: QueryRunner){
        const roomRepository = queryRunner.manager.getCustomRepository(RoomRepository);
        try{
            const room = await roomRepository.insert(createRoomDto);
            if(!room.identifiers[0].id) throw new DatabaseException(consts.INSERT_FAILED, consts.CREATE_ROOM_ERROR_CODE);
            return room.identifiers[0].id;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.createRoom.name, consts.CREATE_ROOM_ERROR_CODE, err);
        }
    }
    async parseArrayToRoomTags(tags: Array<number>, roomId: number):Promise<RoomTag[]>{
        const data = [];
        tags.map(x => data.push({
            room: roomId,
            tag: x
        }))
        console.log(data);
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

}